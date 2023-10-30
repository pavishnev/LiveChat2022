import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JWTtoken } from '../interfaces/JWTtoken.interface';
import { ACCESS_TOKEN_KEY } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OnlineService {
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  public addAgentOnline() {
    return this.httpClient
      .get(`${this.apiUrl}/session/agent-online`)
      .subscribe(
        (val) => {
          console.log('Online agent added successfully');
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public removeAgentOnline() {
    return this.httpClient
      .get(`${this.apiUrl}/session/agent-offline`)
      .subscribe(
        (val) => {
          console.log('Online agent removed successfully');
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
