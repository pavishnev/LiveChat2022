using LiveChat.Data.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiveChat.Data.DataModel
{
    class SessionWithDefinedAgent : Session
    {
        public User User { get; set; }
    }
}
