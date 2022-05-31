using LiveChat.Business.Models;
using LiveChat.Business.Models.RESTRequests;
using LiveChat.Business.Models.RESTResponces;
using LiveChat.Data.Entities;

using SendGrid;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveChat.Business.Services.Interfaces
{
  public interface IUserService
  { 
    Guid? Authenticate(LoginModel login);
    Guid RegisterAdmin(RegisterModel login);
    Task<Guid> RegisterAgent(RegisterAgentModel login);
    Guid CompleteRegisterAgent(CompleteRegisterAgent login);
    bool HasUser(string email);
    bool HasWebsite(string url);
    string GenerateJwt(Guid userId);
    Task<Response> SendEmail(string receiverEmail, string link);
  }
}
