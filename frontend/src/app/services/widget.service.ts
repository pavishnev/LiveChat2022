import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Widget } from '../interfaces/widget.interface';
import { ACCESS_TOKEN_KEY } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private widgetApiUrl = environment.apiUrl + "/widget";

  constructor(private httpClient: HttpClient) { }

  public getWidgetCode(): Observable<any> {
    return this.httpClient.get<any>(`${this.widgetApiUrl}/chat-widget/`);
  }

  public getChatbotContext(): Observable<any> {
    return this.httpClient.get<any>(`${this.widgetApiUrl}/gpt-context/get`);
  }

  public setChatbotContext(context: string): Observable<any> {
    const newContextKey = "newContext"
    let params = new HttpParams().set(newContextKey, context);

    return this.httpClient.post<any>(`${this.widgetApiUrl}/gpt-context/set`, {}, { params: params });
  }

}
