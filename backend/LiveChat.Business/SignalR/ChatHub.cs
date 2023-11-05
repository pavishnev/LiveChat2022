using LiveChat.Business.Models;
using LiveChat.Business.Services.Interfaces;
using LiveChat.Data.Entities;
using LiveChat.Data.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace LiveChat.Business.SignalR
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        const string HELP_MESSAGE = "help";
        private readonly ISessionService _sessionService;
        private readonly ISessionRepository _sessionRepository;
        private readonly IChatLogRepository _chatLogRepository;
        private readonly IUserRepository _userRepository;
        private static readonly List<ChatModel> _chats = new();
        public ChatHub(ISessionService sessionService, ISessionRepository repository, IChatLogRepository chatLogRepository, IUserRepository userRepository)
        {
            _sessionService = sessionService;
            _sessionRepository = repository;
            _chatLogRepository = chatLogRepository;
            _userRepository = userRepository;
        }
        public async Task BroadcastChatData(List<MessageModel> data) { await Clients.All.SendAsync("broadcastchatdata", data); }
        
        public void SendMessageToClient(MessageModel msg)
        {
            Console.WriteLine(JsonSerializer.Serialize(msg));
            try
            {
                var agentId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                Clients.User(msg.SessionId).SendAsync("Receive", msg);
                
                ChatLog chatLog = new ChatLog();
                chatLog.Message = msg.Text;
                chatLog.IsSentByClient = msg.IsSentByClient;
                chatLog.Timestamp = msg.Timestamp;

                chatLog.UserId = _sessionService.GetAgentIdBySessionId(Guid.Parse(msg.SessionId));
                chatLog.SessionId = Guid.Parse(msg.SessionId);

                _chatLogRepository.Add(chatLog);
            }
            catch (Exception ex)
            {
                Clients.Caller.SendAsync("Exception", ex);
            }
        }
  
        public async Task SendMessageToAgent(MessageModel msg)
        {
            Console.WriteLine(JsonSerializer.Serialize(msg));
            try
            {
                var userId = Guid.Parse(Context.User.FindFirstValue(ClaimTypes.NameIdentifier));
                var session = _sessionRepository.GetById(userId);

                //put from BotSpeaking to AgentWaiting
                if (msg.Text == HELP_MESSAGE && !IsWaitingForAgent(userId))
                {
                    _sessionService.AddClientToWaitingList(userId);
                    if (_sessionService.TryConnectClientToAgent(session))
                        PushUpdateToAgentChats(userId.ToString());
                    else await Clients.User(userId.ToString())
                        .SendAsync("Receive", GetAllAgentsBusyModel(userId.ToString()));
                }

                //if waits for Agent, tneh try to add him to agent and push updates to that
                if (IsWaitingForAgent(userId)) {
                    if (_sessionService.TryConnectClientToAgent(session))
                        PushUpdateToAgentChats(userId.ToString());
                }
                if ((IsWaitingForAgent(userId) || IsSpeakingWithBot(userId)) && msg.Text != HELP_MESSAGE)
                {
                    var testMsg = new MessageModel()
                    {
                        IsSentByClient = false,
                        Text = "ChatGpt will be here",
                        Timestamp = DateTime.Now,
                        SessionId = userId.ToString()
                    };
                     await Clients.User(userId.ToString()).SendAsync("Receive", testMsg);

                    //here will send message to bot and back to user
                }
                //check if person is not speaking with bot or waiting for agent
                else if(!(IsWaitingForAgent(userId) || IsSpeakingWithBot(userId)))
                {
                    msg.SessionId = userId.ToString();

                    PushUpdateToAgentChats(userId.ToString());

                    string toAgentId = _sessionService.GetAgentIdBySessionId(userId).ToString();
                    await Clients.User(toAgentId).SendAsync("Receive", msg);

                    _chatLogRepository.Add(CreateChatLog(msg));
                }
                else
                {
                    //  await Clients.User(userId.ToString())
                    //    .SendAsync("Receive", GetAllAgentsBusyModel(userId.ToString()));
                }
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Exception", ex);
            }
        }

        private bool IsWaitingForAgent(Guid userId) => _sessionService.IsSessionInTheAgentWaitingList(userId);
        private bool IsSpeakingWithBot(Guid userId) => _sessionService.IsSessionInTheChatbotList(userId);

        private async void PushUpdateToAgentChats(string clientId)
        {
            var toAgent = _sessionService.GetAgentBySessionId(Guid.Parse(clientId));
            var userChat = _chats.Where(x => x.User.Id == clientId).SingleOrDefault();

            if (!_chats.Any(x => x.User.Id == clientId))
            {
                userChat = CreateChatModel(clientId);
                _chats.Add(userChat);
            }

            var currentChats = _chats.Where(x => toAgent.ClientsOnline.Any(r=>r.Id.ToString() == x.User.Id)).ToList();
            //наверное стоит просто отправлять агенту список актуальных чатов,
            //await Clients.User(toAgent.Id.ToString()).SendAsync("PushChats", currentChats);

            await Clients.User(toAgent.Id.ToString()).SendAsync("AddChat", userChat);
        }

        private MessageModel GetAllAgentsBusyModel(string userId)
        {
            return new MessageModel()
            {
                SessionId = userId,
                IsSentByClient = false,
                Text = "Sorry, there is no available agents now. Please, try again later",
                Timestamp = DateTime.Now
            };
        }
        private ChatLog CreateChatLog(MessageModel msg)
        {
            ChatLog chatLog = new ChatLog();
            chatLog.Message = msg.Text;
            chatLog.IsSentByClient = msg.IsSentByClient;
            chatLog.Timestamp = msg.Timestamp;

            chatLog.UserId = _sessionService.GetAgentIdBySessionId(Guid.Parse(msg.SessionId));
            chatLog.SessionId = Guid.Parse(msg.SessionId);
            return chatLog;
        }

        private ChatModel CreateChatModel(string userId)
        {
            ChatModel chat = new ChatModel();
            var session = _sessionRepository.GetById(Guid.Parse(userId));
            chat.User.Name = session.ClientName;
            chat.User.Id = session.Id.ToString();
            chat.User.WebsiteId = session.WebsiteId.ToString();
            return chat;
        }

        public override Task OnConnectedAsync()
        {
            Clients.Caller.SendAsync("Notify", "Chat started");
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Clients.Caller.SendAsync("Notify", "Chat finished");
            return base.OnDisconnectedAsync(exception);
        }
    }
}
