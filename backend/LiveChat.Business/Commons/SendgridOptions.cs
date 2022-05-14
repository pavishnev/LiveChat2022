using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChat.Business.Commons
{
    public class SendgridOptions
    {
        public string SendgridApiKey { get; set; }
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public string ReceiverName { get; set; }
        public string Subject { get; set; }
        public string PlainTextContent { get; set; }
        public string HtmlContent { get; set; }
    }
}
