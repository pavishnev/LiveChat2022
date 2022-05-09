import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Widget } from '../interfaces/widget.interface';
import { ACCESS_TOKEN_KEY } from './auth.service';

  const headers =  new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
      });

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
private widgetApiUrl = environment.apiUrl + "/widget";

  constructor(private httpClient: HttpClient) { }

  public getWidgetCode():Observable<any>{
    return this.httpClient.get<any>(`${this.widgetApiUrl}/chat-widget/`, {
      headers: headers,
    });
  }

}
