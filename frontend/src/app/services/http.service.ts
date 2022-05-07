import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginModel } from "../models/login.model";
import {RegisterModel} from "../models/register.model";
import {environment} from "../../environments/environment";
import {SessionStatus} from "../interfaces/session-status.interface";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  sendLoginCredentials(loginCredentials: LoginModel) {
    const body = { email: loginCredentials.email, password: loginCredentials.password}

    return this.http.post(`${this.apiUrl}/auth/sign-in`, body);
  }

  sendRegisterCredentials(registerCredentials: RegisterModel) {
    const body = {name: registerCredentials.name,
      email: registerCredentials.email,
      password: registerCredentials.password,
      websiteUrl: registerCredentials.websiteUrl
      };

    return this.http.post(`${this.apiUrl}/auth/sign-up`, body);
  }

  public getSessionStatus(sessionId: string) {
    return this.http.get<SessionStatus>(`${this.apiUrl}/session/session-status/${sessionId}`);
  }
}
