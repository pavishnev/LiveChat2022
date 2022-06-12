using LiveChat.Data.DataModel;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChat.Data.Repositories.Interfaces
{
    public interface IStatisticsRepository
    {
        IList<AgentStatModel> GetCompletedChatsCount(Guid websiteId);
        IList<AgentStatModel> GetAverageCountOfMessagesInChat(Guid websiteId);
        IList<AgentStatModel> GetAverageChatDuration(Guid websiteId);
        IList<AgentStatModel> GetMaximumChatsCompletedDay(Guid websiteId);
    }
}
