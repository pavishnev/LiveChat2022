import { MessageModel } from 'src/app/models/message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatHistoryTableElement } from '../interfaces/chat-history-table-element.interface';
import { ACCESS_TOKEN_KEY } from './auth.service';

  const headers =  new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
      });
@Injectable({
  providedIn: 'root'
})
export class ChatsHistoryService {
  
  private chatLogApiUrl = environment.apiUrl + "/chatlog";
constructor(private httpClient: HttpClient) { }

public getSessionsList(pageIndex:number,pageSize:number):Observable<ChatHistoryTableElement[]>{
  return this.httpClient.get<ChatHistoryTableElement[]>(`${this.chatLogApiUrl}/session-history/${pageIndex}/${pageSize}`,{headers:headers});
}

public getSessionsCount():Observable<number>{
  return this.httpClient.get<number>(`${this.chatLogApiUrl}/get-sessions-count`,{headers:headers});
}

public getChatHistory(sessionId:string):Observable<MessageModel[]>{
  return this.httpClient.get<MessageModel[]>(`${this.chatLogApiUrl}/chat-history/${sessionId}`,{headers:headers});
}

}
