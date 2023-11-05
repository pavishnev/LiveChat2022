import { Injectable, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { IHttpConnectionOptions } from '@microsoft/signalr';
import { AsyncLocalStorage } from 'async_hooks';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JWTtoken } from '../interfaces/JWTtoken.interfase';
import { MessageModel } from "../models/message.model";
import { SESSION_TOKEN } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService implements OnInit {
  public static data: MessageModel[] = [];
  public static broadcastedData: MessageModel[] = [];
  private hubConnection!: signalR.HubConnection;
  public accessToken = localStorage.getItem(SESSION_TOKEN)!;

  constructor() { }

  options: IHttpConnectionOptions = {
    accessTokenFactory: () => {
      return this.accessToken;
    }
  };

  ngOnInit(): void {
    // Refreshing chat messages every second
    this.startConnection();
  }

  public startConnection = () => {
    this.accessToken = localStorage.getItem(SESSION_TOKEN)!;

    this.options = {
      accessTokenFactory: () => {
        return this.accessToken;
      },
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/chat`, this.options)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection with chat backend established');
      })
      .catch(err => console.log('Got error while connecting to backend: ' + err));

    this.Receive();
  }

  public SendMessage(Message: MessageModel) {
    if (Message.text != "") {
      this.hubConnection.invoke('SendMessageToAgent', Message)
        .catch(err => console.error(err));
      SignalrService.broadcastedData.push(Message);
      localStorage.setItem('chat', JSON.stringify(SignalrService.broadcastedData));
    }
  }

  public Receive = () => {
    this.hubConnection.on('Receive', (data) => {
      if (data.text != "") {
        SignalrService.broadcastedData.push(data);
        localStorage.setItem('chat', JSON.stringify(SignalrService.broadcastedData));
      }
    })
  }
}
