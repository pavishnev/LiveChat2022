import { MessageModel } from 'src/app/models/message.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatHistoryTableElement } from '../interfaces/chat-history-table-element.interface';
import { ACCESS_TOKEN_KEY } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatsHistoryService {
  
  private chatLogApiUrl = environment.apiUrl + "/chatlog";
constructor(private httpClient: HttpClient) { }

public getSessionsList(pageIndex:number,pageSize:number):Observable<ChatHistoryTableElement[]>{
  return this.httpClient.get<ChatHistoryTableElement[]>(`${this.chatLogApiUrl}/session-history/${pageIndex}/${pageSize}`);
}

public getSessionsCount():Observable<number>{
  return this.httpClient.get<number>(`${this.chatLogApiUrl}/get-sessions-count`);
}

public getChatHistory(sessionId:string):Observable<MessageModel[]>{
  return this.httpClient.get<MessageModel[]>(`${this.chatLogApiUrl}/chat-history/${sessionId}`);
}

}
