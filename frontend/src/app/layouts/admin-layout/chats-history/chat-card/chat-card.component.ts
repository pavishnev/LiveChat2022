import { ChatsHistoryService } from './../../../../services/chats-history.service';

import { partitionArray } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { time } from 'console';
import {Subscription} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageModel } from 'src/app/models/message.model';
@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.css']
})
export class ChatCardComponent implements OnInit {
   private routeSubscription: Subscription;
  //sessionId
  //must be given here through route parameters
  //on Component init, will send get request with id and initialize all the other fields
  messagesArchive: MessageModel[]=[];//архив сообщений
  
  sessionId!: string;
  
  agentName!: string;
  clientName!: string;
  startedAt!:Date;
  endedAt!:Date; 


  constructor( 
      private route: ActivatedRoute,
       private router: Router,
       private chatsHistoryService:ChatsHistoryService
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.sessionId=params['id']);
        this.routeSubscription = route.queryParams.subscribe(
            (queryParam: any) => {
                this.agentName = queryParam['agentName'];
                this.clientName = queryParam['clientName'];
                this.startedAt = queryParam['startedAt'];
                this.endedAt = queryParam['endedAt'];
            }
        );    
    }

   public goToParentComponent(){
    this.router.navigate(["admin/chats-history"]);
   }
 public sendMessage (message: string)
  {
   

  }
 ngOnInit() {
  this.chatsHistoryService.getChatHistory(this.sessionId).subscribe(
    data=>{
        this.messagesArchive = data;
    });
  //  this.startedAt= new Date();
  //   this.endedAt= new Date();
  //   this.agentName="Svitlana";
  //    this.clientName="Petya";

    // var aaa:MessageModel={
    //   sessionId:"some-id",
    //   isSentByClient:false,
    //   text:"aboba",
    //   timestamp:new Date()
    // }
    // this.messagesArchive.push(aaa);

    }
 
}
