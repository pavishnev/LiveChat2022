import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgentStatModel } from '../models/agent-stat.model';

@Injectable({
  providedIn: 'root',
})

export class StatisticsService {
  private statisticsApiUrl = environment.apiUrl + '/statistics';
  constructor(private httpClient: HttpClient) {}

public getChatsCountPerAgent():Observable<AgentStatModel[]>{
  return this.httpClient.get<AgentStatModel[]>(`${this.statisticsApiUrl}/chats-count-per-agent`);
}

public getAvgCountOfMessages():Observable<AgentStatModel[]>{
  return this.httpClient.get<AgentStatModel[]>(`${this.statisticsApiUrl}/chats-avg-count-of-messages`);
}

public getAvgChatDuration():Observable<AgentStatModel[]>{
  return this.httpClient.get<AgentStatModel[]>(`${this.statisticsApiUrl}/avg-chat-duration`);
}
public getMaxChatsDay():Observable<AgentStatModel[]>{
  return this.httpClient.get<AgentStatModel[]>(`${this.statisticsApiUrl}/max-chats-completed`);
}

}
