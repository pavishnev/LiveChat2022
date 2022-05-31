import { Component, OnInit } from '@angular/core';
import {from, interval} from 'rxjs';

import { MessageModel } from '../../../models/message.model';
import { SignalRService } from '../../../services/signal-r.service';
import { ChatModel } from '../../../models/chat.model';
import { AuthService } from '../../../services/auth.service';

import { DatePipe } from "@angular/common";
import {ChatRemoverService} from "../../../services/chat-remover.service";
import {OnlineService} from "../../../services/online.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  constructor(private _signalRService: SignalRService,
              private _authorizeService: AuthService,
              private _chatRemover: ChatRemoverService,
              private _onlineService: OnlineService) {
  }

  // Current user message
  message: MessageModel = {sessionId: "", text: "", isSentByClient: true, timestamp: new Date()};

  // Received messages array
  received: MessageModel[] = [];
  chats: ChatModel[] = [];
  chat: ChatModel = new ChatModel();

  pipe: DatePipe = new DatePipe('en-US');

  // Current user name
  userName!: string;
  sessionId!: string;
  chatsVisible: boolean = true;

  isOnline: boolean = true;

  ngOnInit(): void {

    // Refreshing chat messages every second
    interval(1000).subscribe(() => {
      if(this.chats.indexOf(this.chat) == -1)
      {
        this.chat = new ChatModel();
      }
      this.chats = SignalRService.chats;
      localStorage.setItem('chats', JSON.stringify(this.chats));
    });

    interval(60000).subscribe(() => {
      this._chatRemover.refreshChatsList();
    })


  }

  setCurrentChat(cChat: ChatModel) {
    this.chat = cChat;
    this.chatsVisible = true;
    console.log(cChat.user.id);
  }

  switchOnlineStatus() {
    this.isOnline = !this.isOnline;
    if(this.isOnline)
    {
      this._onlineService.addAgentOnline();
    }
    else
    {
      this._onlineService.removeAgentOnline();
    }
  }

  public sendMessage(message: string) {
    let messageModel: MessageModel = new MessageModel();
    messageModel.sessionId = this.chat.user.id;
    messageModel.text = message;
    messageModel.isSentByClient = false;

    // If message is not empty - sending data to all other clients
    if (message != "") {
      SignalRService.chats[SignalRService.chats.indexOf(this.chat)].messages.push(messageModel);
      this._signalRService.sendMessage(messageModel);
    }
  }

  toggleChatBox() {
    this.chatsVisible = !this.chatsVisible;
  }
}
