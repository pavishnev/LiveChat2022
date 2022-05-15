import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SessionStatus} from "../models/session-status.model";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public getSessionStatus(sessionId: string) {
    return this.http.get<SessionStatus>(`${environment.apiUrl}/session/session-status/${sessionId}`);
  }
}
