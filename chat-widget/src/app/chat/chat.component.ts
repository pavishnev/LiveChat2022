import {Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { animate, style, transition, trigger } from '@angular/animations'
import { interval } from "rxjs";

import { SignalrService } from "../services/signalr.service";
import { MessageModel } from "../models/message.model";
import {AuthService, SESSION_TOKEN} from '../services/auth.service';
import { ClientModel } from '../models/client.model';

import { DatePipe } from '@angular/common';
import {HttpService} from "../services/http.service";


@Component({
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ bottom: -510 }),
            animate('0.2s ease-out',
              style({ bottom: 60 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ bottom: 60 }),
            animate('0.2s ease-in',
              style({ bottom: -510 }))
          ]
        )
      ]
    )
  ]
})
export class ChatComponent implements OnInit {
  constructor(private _signalRService: SignalrService,
              private _authService: AuthService,
              private _http: HttpService) { }
// в html именование атрибута отличается, пишется в стиле kebab-case, то есть website-id 
@Input() public websiteId!: string;         
  sessionId: string = "test";
    client:ClientModel={Name:"", WebsiteId:this.websiteId, Id:""};
  //client:ClientModel={Name:"",WebsiteId:"8DEA0B6D-C6CC-4189-ACDE-EADA87C16B9A",Id:""};
  message: MessageModel= { sessionId:"", text:"", isSentByClient: true, timestamp: new Date() };

  received: MessageModel[] = [{ sessionId:"", text:"", isSentByClient: true, timestamp: new Date() }];
  chat: MessageModel[]=[];

  username!: string;

  isOpen: boolean = false;

  pipe: DatePipe = new DatePipe('en-US');

  isTokenReceived: boolean = false;

  @ViewChild('messageInput') input: any;

    
  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  closeChat()
  {
    this.isTokenReceived=false;
    this._authService.endSession();
    localStorage.setItem('chat', "");
    SignalrService.broadcastedData = [];
  }

  sendName(name: string) {
    this.isTokenReceived = true;
    this.client.Name=name;
    this._authService.startSession(this.client).subscribe((val)=>{
      this.client.Id = this._authService.decodeUserToken();
    })
    
  }

  getDateTimeNow(){
    return new Date();
  }

  sendMessage(message: string, date: string)
  {
    let messageModel: MessageModel = new MessageModel();
    messageModel.sessionId = localStorage.getItem(SESSION_TOKEN)!;
    messageModel.text = message;
    messageModel.isSentByClient = true;

    messageModel.timestamp = new Date();

    this.input.nativeElement.value = '';

    if(message != "") {
      this._signalRService.SendMessage(messageModel);
    }
  }

  ngOnInit(): void {
    console.log(this.websiteId);
    this.client.WebsiteId = this.websiteId;
    if (this._authService.isUserAuthorizedGetter) {
      this._signalRService.startConnection();
    }

    if(localStorage.getItem('chat') != null)
    {
      console.log('chat is not null');
      if(localStorage.getItem(SESSION_TOKEN) != null)
      {
        console.log('session token is not null');
        this._http.getSessionStatus(this._authService.decodeUserToken())
          .subscribe((data: any) => {
            if (data.isSessionActive != true)
            {
              localStorage.removeItem('chat');
              this.isTokenReceived = false;
              localStorage.removeItem(SESSION_TOKEN);
            }
            else
            {
              this.isTokenReceived = true;
            }
          });
      }
      else
      {
        localStorage.removeItem('chat');
        localStorage.removeItem(SESSION_TOKEN);
        this.isTokenReceived = false;
      }
      SignalrService.broadcastedData = JSON.parse(localStorage.getItem('chat')!);
    }
    else
    {
      localStorage.removeItem('chat');
      this.isTokenReceived = false;
    }

    interval(1000).subscribe(() => {
      this.received = SignalrService.broadcastedData;
    })

    /*if(localStorage.getItem(SESSION_TOKEN) != "")
    {
      this.isTokenReceived = true;
    }*/
  }
}
