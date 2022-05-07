import { Injectable, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { IHttpConnectionOptions } from '@microsoft/signalr';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatModel } from '../models/chat.model';
import { MessageModel } from '../models/message.model';
import { ACCESS_TOKEN_KEY } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnInit {
  public static data: MessageModel[]=[];
  public static broadcastedData: MessageModel[]=[];
  public static chats:ChatModel[]=[];
  public accessToken= localStorage.getItem(ACCESS_TOKEN_KEY)!;
  private hubConnection!: signalR.HubConnection;

  ngOnInit(): void
  {
    // Refreshing chat messages every second
  this.startConnection();

  }
  options: IHttpConnectionOptions = {
    accessTokenFactory: () => {
      return this.accessToken;
    }
  };

  public startConnection = () => {
    console.log("startC");
    this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)!;
    this.options= {
      accessTokenFactory: () => {
        return this.accessToken;
      }
    };
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/chat`, this.options)
      .build();

    this.hubConnection
      .start()
      .then(() => {console.log('Connection with chat backend established');})
      .catch(err => console.log('Got error while connecting to backend: ' + err));

    this.receive();
    this.addBroadcastChatDataListener();
    this.addChat();

    let chatsTemp: ChatModel[] = JSON.parse(localStorage.getItem('chats')!);

    if(chatsTemp != null) {
      SignalRService.chats = chatsTemp;
    }
  }

  public broadcastChatData = (Message: MessageModel[]) => {
    const data = Message.map(m => {
      const temp = {
        sessionId: m.sessionId,
        text: m.text,
        isSentByClient: m.isSentByClient
      }
      console.log("send");
      console.log(temp.isSentByClient);
      return temp;
    });

    this.hubConnection.invoke('broadcastchatdata', data)
      .catch(err => console.error(err));
  }

  public addBroadcastChatDataListener = () => {
    this.hubConnection.on('broadcastchatdata', (data) => {
      if(data.text != ""){
        SignalRService.broadcastedData.push(data[0]);
      }
    })
  }

  public sendMessage (Message: MessageModel) {
    this.hubConnection.invoke('SendMessageToClient', Message)
      .catch(err => console.error(err));
  }

  public addChat = () => {
    this.hubConnection.on('AddChat', (data) => {
       if(!SignalRService.chats.includes(data)){
         SignalRService.chats.push(data);
         console.log(data);
      }
    });
  }

  public receive = () => {
    this.hubConnection.on('Receive', (data) => {
      if(data.text != ""){
        SignalRService.chats.forEach(chat => {
          if(data.sessionId == chat.user.id){
            console.log(chat);
            chat.messages.push(data);
          }
        });
        //SignalRService.broadcastedData.push(data);
      }
    })
  }
}
