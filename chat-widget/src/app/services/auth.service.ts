import { Injectable } from '@angular/core';
import { Observable, pipe, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ClientModel } from '../models/client.model';
import { HttpClient } from '@angular/common/http';
import { JWTtoken } from '../interfaces/JWTtoken.interfase';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SignalrService } from './signalr.service';

const mockObj={};

export const SESSION_TOKEN = 'sessionToken';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessToken = localStorage.getItem(SESSION_TOKEN)!;
  public isUserAuthenticatedSubject: Subject<boolean> = new Subject<boolean>();
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private signalr: SignalrService
  ) {}

  public get getToken(): string | undefined {
    const token = localStorage.getItem(SESSION_TOKEN);

    this.isUserAuthenticatedSubject.next(
      token != undefined && !this.jwtHelper.isTokenExpired(token)
    );
    return token === null ? undefined : token;
  }
  public get isUserAuthenticated(): boolean {
    return (
      this.getToken != undefined &&
      this.getToken != null &&
      !this.jwtHelper.isTokenExpired(this.getToken)
    );
  }

  public startSession(client: ClientModel): Observable<JWTtoken> {
    return this.http
      .post<JWTtoken>(`${environment.apiUrl}/session/start-session`, client)
      .pipe(
        tap(
          (value) => {
            this.initStorageInfo(value);
            this.signalr.startConnection();
          },
          (error) => {
            console.log('error');
          }
        )
      );
  }
  private initStorageInfo(info: any): void {
    localStorage.removeItem(SESSION_TOKEN);
    localStorage.setItem(SESSION_TOKEN, info.sessionToken);
    this.accessToken = localStorage.getItem(SESSION_TOKEN)!;
    console.log('token set');
  }

  public decodeUserToken() {
    let token = localStorage.getItem(SESSION_TOKEN)!;
    let tokenInfo = this.jwtHelper.decodeToken(token);
    return tokenInfo.sub;
  }

  public endSession(): void {
    console.log('END SESSION');
    this.http
      .post(`${environment.apiUrl}/session/stop-session`, mockObj)
      .subscribe(
        (value) => {
          localStorage.clear();
        },
        (error) => {
          console.log('error');
        }
      );
  }
  public get isUserAuthorizedGetter(): boolean {
    const token = localStorage.getItem(SESSION_TOKEN);
    return token != undefined;
  }
}


