import { Injectable } from '@angular/core';
import {ChatModel} from "../models/chat.model";
import {SignalRService} from "./signal-r.service";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class ChatRemoverService {

  constructor(private http: HttpService) { }

  public refreshChatsList()
  {
    let chats: ChatModel[] = SignalRService.chats;
    chats.forEach(chat => {
      this.http.getSessionStatus(chat.user.id)
        .subscribe((data: any) => {
          if(data.isSessionActive != true)
          {
            chats.splice(chats.indexOf(chat), 1);
          }
        });
    });
    SignalRService.chats = chats;
  }
}
