using LiveChat.Data.DataModel;
using LiveChat.Data.Repositories.Interfaces;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChat.Data.Repositories
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private LiveChatDbContext _context;

        public StatisticsRepository(LiveChatDbContext context)
        {
            _context = context;
        }

        public IList<AgentStatModel> GetAverageChatDuration(Guid websiteId)
        {
            var sessions = _context.Sessions
               .Where(x => x.WebsiteId == websiteId && x.ChatLogs.Count > 0)
               .Include(x => x.ChatLogs)
               .ThenInclude(x => x.User);

            var sessionsMapped = sessions.Select(x => new
            {
                Id = x.Id,
                ClientName = x.ClientName,
                StartedAt = x.StartedAt,
                EndedAt = x.ChatLogs.OrderBy(z => z.Timestamp).Last().Timestamp,
                WebsiteId = x.WebsiteId,
                User = x.ChatLogs.First().User,
                //ChatDurationInMinutes = (x.ChatLogs.OrderBy(z => z.Timestamp).LastOrDefault().Timestamp - x.StartedAt)
            }).ToList();

            var stat = sessionsMapped
             .GroupBy(p => p.User.Name)
             .Select(g => new AgentStatModel() { AgentName = g.Key, Value = g.Select(x => (x.EndedAt - x.StartedAt).TotalMinutes).Average() })
             .ToList();

            return stat;
        }

        public IList<AgentStatModel> GetAverageCountOfMessagesInChat(Guid websiteId)
        {
            var sessions = _context.Sessions
               .Where(x => x.WebsiteId == websiteId && x.ChatLogs.Count > 0)
               .Include(x => x.ChatLogs)
               .ThenInclude(x => x.User);

            var sessionsMapped = sessions.Select(x => new
            {
                Id = x.Id,
                ClientName = x.ClientName,
                StartedAt = x.StartedAt,
                EndedAt = x.EndedAt,
                WebsiteId = x.WebsiteId,
                User = x.ChatLogs.First().User,
                ChatLogMessagesCount = x.ChatLogs.Count
            }).ToList();

            var stat = sessionsMapped
             .GroupBy(p => p.User.Name)
             .Select(g => new AgentStatModel() { AgentName = g.Key, Value = g.Select(x=>x.ChatLogMessagesCount).Average() })
             .ToList();

            return stat;
        }

        public IList<AgentStatModel> GetCompletedChatsCount(Guid websiteId)
        {
            var sessions = _context.Sessions
                .Where(x => x.WebsiteId == websiteId && x.ChatLogs.Count > 0)
                .Include(x => x.ChatLogs)
                .ThenInclude(x=>x.User);

            var sessionsMapped = sessions.Select(x => new SessionWithDefinedAgent()
            {
                Id = x.Id,
                ClientName = x.ClientName,
                StartedAt = x.StartedAt,
                EndedAt = x.EndedAt,
                WebsiteId = x.WebsiteId,
                User = x.ChatLogs.First().User,
            }).ToList();


            var stat = sessionsMapped
                .GroupBy(p => p.User.Name)
                .Select(g => new AgentStatModel() { AgentName = g.Key, Value = g.Count() })
                .ToList();

            return stat;

        }

        public IList<AgentStatModel> GetMaximumChatsCompletedDay(Guid websiteId)
        {
            var sessions = _context.Sessions
                .Where(x => x.WebsiteId == websiteId && x.ChatLogs.Count > 0)
                .Include(x => x.ChatLogs)
                .ThenInclude(x => x.User);

            var sessionsMapped = sessions.Select(x => new SessionWithDefinedAgent()
            {
                Id = x.Id,
                ClientName = x.ClientName,
                StartedAt = x.StartedAt,
                EndedAt = x.EndedAt,
                WebsiteId = x.WebsiteId,
                User = x.ChatLogs.First().User,
            }).ToList();

            var aaa = sessionsMapped
                .GroupBy(p => p.StartedAt.Date)
                .Select(s => new
                {
                    Users = s.Select(z=>z.User.Name).ToList()
                })
                .ToList();

            var stat = sessionsMapped
                .GroupBy(p => p.User.Name)
                .Select(g => new AgentStatModel() { AgentName = g.Key, Value =aaa.Select(   d=>d.Users.Where(f=>f == g.Key).ToList().Count      ).Max() })
                .ToList();

            return stat;
        }
    }
}
