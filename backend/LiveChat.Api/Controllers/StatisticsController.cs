using LiveChat.Constants.Enums;
using LiveChat.Data.Repositories.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChat.Api.Controllers
{
    [Authorize(Roles = Roles.Admin)]
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsRepository _statisticsRepo;
        public StatisticsController(IStatisticsRepository statisticsRepo)
        {
            _statisticsRepo = statisticsRepo;
        }

        [HttpGet("chats-count-per-agent")]
        public IActionResult ChatsCountPerAgent()
        {
            string websiteId = User.FindAll("websiteId").Select(x => x.Value).FirstOrDefault();
            return Ok(_statisticsRepo.GetCompletedChatsCount(Guid.Parse(websiteId)));
        }

        [HttpGet("chats-avg-count-of-messages")]
        public IActionResult ChatsAvgCountOfMessages()
        {
            string websiteId = User.FindAll("websiteId").Select(x => x.Value).FirstOrDefault();
            return Ok(_statisticsRepo.GetAverageCountOfMessagesInChat(Guid.Parse(websiteId)));
        }

        [HttpGet("avg-chat-duration")]
        public IActionResult GetAvgChatDuration()
        {
            string websiteId = User.FindAll("websiteId").Select(x => x.Value).FirstOrDefault();
            return Ok(_statisticsRepo.GetAverageChatDuration(Guid.Parse(websiteId)));
        }

        [HttpGet("max-chats-completed")]
        public IActionResult ffff()
        {
            string websiteId = User.FindAll("websiteId").Select(x => x.Value).FirstOrDefault();
            return Ok(_statisticsRepo.GetMaximumChatsCompletedDay(Guid.Parse(websiteId)));
        }
    }
}
