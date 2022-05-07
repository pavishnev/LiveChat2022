import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientModel } from '../models/client.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JWTtoken } from '../interfaces/JWTtoken.interfase';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SignalrService } from './signalr.service';

const mockObj={};

export const SESSION_TOKEN = 'sessionToken';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessToken=localStorage.getItem(SESSION_TOKEN)!;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private signalr:SignalrService) { }

  public startSession(client:ClientModel)
  {
    this.http.post<JWTtoken>(`${environment.apiUrl}/session/start-session`,client)
    .subscribe(value=>{this.initStorageInfo(value);
    this.signalr.startConnection();
    },error => { console.log("error");
  });
  }
  private initStorageInfo(info:any):void {
    localStorage.removeItem(SESSION_TOKEN);
    localStorage.setItem(SESSION_TOKEN, info.sessionToken);
    this.accessToken=localStorage.getItem(SESSION_TOKEN)!;
    console.log("token set");
  }

  public decodeUserToken() {
      let token= localStorage.getItem(SESSION_TOKEN)!;
      let tokenInfo = this.jwtHelper.decodeToken(token);
      return tokenInfo.sub;
  }

  public endSession(): void {
    console.log("END SESSION");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`
    })
    this.http.post(`${environment.apiUrl}/session/stop-session`,mockObj,{headers:headers})
    .subscribe(value=>{  localStorage.clear();},error => { console.log("error");});
  }
  public get isUserAuthorizedGetter(): boolean {
    const token = localStorage.getItem(SESSION_TOKEN);
    return token!=undefined
  }
}
