using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChat.Business.Services.Interfaces
{
    public interface IGptSupportService
    {
        public string GetContext(Guid websiteId);
        public string SetContext(Guid websiteId, string newContext);
    }
}
