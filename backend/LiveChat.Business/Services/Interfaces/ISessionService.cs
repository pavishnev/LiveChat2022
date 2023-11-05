using LiveChat.Business.Models;
using LiveChat.Data.Entities;
using System;

namespace LiveChat.Business.Services.Interfaces
{
    public interface ISessionService
    {
        Guid StartSession(ClientModel newClient);
        void DisconnectClient(Guid id);
        void AddAgentOnline(AgentModel agent);
        void RemoveAgentOnline(AgentModel agent);
        bool SessionExists(Guid Id);
        bool SessionIsActive(Guid Id);
        bool IsAgentOnline(AgentModel agent);
        string GenerateJwt(Guid sessionId);
        Guid GetAgentIdBySessionId(Guid sessionId);
        AgentModel GetAgentBySessionId(Guid sessionId);
        bool IsSessionInTheAgentWaitingList(Guid id);
        bool IsSessionInTheChatbotList(Guid id);
        void AddClientToWaitingList(Guid sessionId);
        bool TryConnectClientToAgent(Session session);
    }
}
