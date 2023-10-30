import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AnySoaRecord } from 'dns';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AgentRegisterComplete } from '../interfaces/agent-register-complete.interface';
import { JWTtoken } from '../interfaces/JWTtoken.interface';
import { Login } from '../interfaces/login.interface';
import { Register } from '../interfaces/register.interface';
import { SignalRService } from './signal-r.service';

export const ACCESS_TOKEN_KEY = 'access_token';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userId: string | undefined;
  private name: string | undefined;
  private email: string | undefined;
  private role: string | undefined;
  private websiteUrl: string | undefined;

  private isUserAuthorized = new Subject<boolean>();

  boolObserved$ = this.isUserAuthorized.asObservable();
  public isUserAuthenticatedSubject: Subject<boolean> = new Subject<boolean>();
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private signalr: SignalRService
  ) {}

  public get getToken(): string | undefined {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    this.isUserAuthenticatedSubject.next(
      token != undefined && !this.jwtHelper.isTokenExpired(token)
    );
    return token === null ? undefined : token;
  }

  private initStorageInfo(info: any): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.setItem(ACCESS_TOKEN_KEY, info.access_token);
    // console.log("local storage token: "+ACCESS_TOKEN_KEY);
    //   console.log("incoming token: "+info.access_token);
    this.signalr.startConnection();
  }

  public get isUserAuthenticated(): boolean {
    return (
      this.getToken != undefined &&
      this.getToken != null &&
      !this.jwtHelper.isTokenExpired(this.getToken)
    );
  }

  private decodeUserToken() {
    try {
      let token = localStorage.getItem(ACCESS_TOKEN_KEY)!;
      let tokenInfo = this.jwtHelper.decodeToken(token);
      this.userId = tokenInfo.sub;
      this.name = tokenInfo.name;
      this.role = tokenInfo.role;
      this.email = tokenInfo.email;
      this.websiteUrl = tokenInfo.websiteUrl;
    } catch {
      this.router.navigate(['auth']);
    }
  }
  public routeToAllowedLayout() {
    this.decodeUserToken();
    if (this.role === 'admin') this.router.navigate(['admin/widget']);
    else if (this.role === 'agent') this.router.navigate(['agent/chats']);
    else this.router.navigate(['auth']);
  }

  public signIn(login: Login): Observable<JWTtoken> {
    return this.httpClient
      .post<JWTtoken>(`${this.apiUrl}/auth/sign-in`, login)
      .pipe(
        tap((info) => {
          this.initStorageInfo(info);
          // this.decodeUserToken();
          // this.routeToAllowedLayout();
        })
      );
  }

  public signUp(register: Register): Observable<JWTtoken> {
    //console.log(register)
    return this.httpClient
      .post<JWTtoken>(`${this.apiUrl}/auth/sign-up`, register)
      .pipe(
        tap((info) => {
          this.initStorageInfo(info);
          //  this.decodeUserToken();
          //  this.routeToAllowedLayout();
        })
      );
  }
  public signUpAgentComplete(obj: AgentRegisterComplete): Observable<JWTtoken> {
    return this.httpClient
      .post<JWTtoken>(`${this.apiUrl}/auth/sign-up-agent-complete`, obj)
      .pipe(
        tap((info) => {
          this.initStorageInfo(info);
          //  this.decodeUserToken();
          //  this.routeToAllowedLayout();
        })
      );
  }
  public signOut(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.router.navigate(['auth']);
  }

  public get isUserAuthorizedGetter(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    this.isUserAuthorized.next(
      token != undefined && !this.jwtHelper.isTokenExpired(token)
    );
    return token != undefined && !this.jwtHelper.isTokenExpired(token);
  }
  public get isUserAuthorizedAsAdmin(): boolean {
    this.decodeUserToken();
    return this.role === 'admin';
  }
  public get isUserAuthorizedAsAgent(): boolean {
    this.decodeUserToken();
    return this.role === 'agent';
  }
}