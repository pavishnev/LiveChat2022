import { ChatsHistoryService } from './../../../services/chats-history.service';
import { createInjectableDefinitionMap } from '@angular/compiler/src/render3/partial/injectable';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatHistoryTableElement } from 'src/app/interfaces/chat-history-table-element.interface';


// let ELEMENT_DATA: ChatHistoryTableElement[] = [
//   {id: 'dfsdf', name: 'Hydrogen', startedAt: new Date(), endedAt: new Date()},
//  {id: 'dfsd543f', name: 'Oxugem', startedAt: new Date(), endedAt: new Date()},
//   {id: 'dfsccdf', name: 'Carbonn', startedAt: new Date(), endedAt: new Date()},
//    {id: 'dfxxsdf', name: 'Uranium', startedAt: new Date(), endedAt: new Date()},
//    {id: 'dfууxxsdf', name: 'ваываы', startedAt: new Date(), endedAt: new Date()},
//    {id: 'dfxxsааdf', name: 'ененеке', startedAt: new Date(), endedAt: new Date()},
//    {id: 'dfxxввsdf', name: 'бббббб', startedAt: new Date(), endedAt: new Date()},
//    {id: 'dfxxииsdf', name: 'Uranисмимсium', startedAt: new Date(), endedAt: new Date()},
// ]
@Component({
  selector: 'app-chats-history',
  templateUrl: './chats-history.component.html',
  styleUrls: ['./chats-history.component.css']
})
export class ChatsHistoryComponent implements OnInit {

 displayedColumns: string[] = ['agentName', 'clientName', 'startedAt', 'endedAt'];
sessionsCount!:number;
dataSource!:MatTableDataSource<ChatHistoryTableElement>; 
 @Input()
  pageEvent!: PageEvent;
 
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  constructor(private route: ActivatedRoute,
               private router: Router,
               private chatsHistoryService:ChatsHistoryService   ) {
                 
                }

  ngOnInit() {
    this.chatsHistoryService.getSessionsList(1,5).subscribe(data=>{;
      this.dataSource= new MatTableDataSource<ChatHistoryTableElement>(data);
    });

    this.chatsHistoryService.getSessionsCount().subscribe(count=>{
      this.sessionsCount=count;
    })
  }

  onPageChange(event:PageEvent){
    this.pageEvent=event;
    this.chatsHistoryService.getSessionsList(this.pageEvent.pageIndex+1,this.pageEvent.pageSize)
    .subscribe(data=>{
      this.dataSource= new MatTableDataSource<ChatHistoryTableElement>(data);
     // console.log("Count of elements per page:" + this.pageEvent.pageSize);
    },(error)=>{
      console.log(error);
    });
    this.chatsHistoryService.getSessionsCount().subscribe(count=>{
      this.sessionsCount=count;
    })
  }

}


