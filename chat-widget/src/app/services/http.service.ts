import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {SessionStatus} from "../models/session-status.model";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public getSessionStatus(sessionId: string) {
    return this.http.get<SessionStatus>(`${environment.apiUrl}/session/session-status/${sessionId}`);
  }
}
