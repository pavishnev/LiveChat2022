using LiveChat.Business.Services.Interfaces;
using LiveChat.Data.Repositories.Interfaces;
using System;

namespace LiveChat.Business.Services
{
    public class GptSupportService : IGptSupportService
    {
        private readonly IWebsiteRepository _websiteRepository;

        public GptSupportService(IWebsiteRepository website)
        {
            _websiteRepository = website;
        }

        public string GetContext(Guid websiteId)
        {
            return _websiteRepository.GetById(websiteId).AiContext ?? "Put your context here";
        }

        public string SetContext(Guid websiteId, string newContext)
        {
            var website = _websiteRepository.GetById(websiteId);
            website.AiContext = newContext;
            return _websiteRepository.Edit(website).AiContext;
        }
    }
}
