import { ACCESS_TOKEN_KEY } from './auth.service';

import { JWTtoken } from './../interfaces/JWTtoken.interface';
import { AgentRegisterComplete } from './../interfaces/agent-register-complete.interface';
import { AgentRegister } from './../interfaces/agent-register.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AgentsTableElement } from '../interfaces/agents-table-element.interface';
import { UserId } from '../interfaces/user-id.interface';
  
@Injectable({
  providedIn: 'root'
})

export class AgentsAuthService {
 private adminPageApiUrl = environment.apiUrl + "/AdminPage";
  private authApiUrl = environment.apiUrl + "/auth";

constructor(private httpClient: HttpClient) { }

public getAllAgents():Observable<AgentsTableElement[]>{
  return this.httpClient.get<AgentsTableElement[]>(`${this.adminPageApiUrl}/get-all-agents`);
}

public getAgentCredentials(id:string):Observable<AgentsTableElement>{
  return this.httpClient.get<AgentsTableElement>(`${this.adminPageApiUrl}/get-agent-credentials/`,{params:{id:id}});
}

public signUpAgent(obj:AgentRegister):Observable<UserId>{
  return this.httpClient.post<UserId>(`${this.authApiUrl}/sign-up-agent/`,obj);
}
 public deleteAgent(id:string):Observable<void>{
   //send user id to the server to delete
   return this.httpClient.delete<void>(`${this.adminPageApiUrl}/delete-agent/${id}`);
 }


}
