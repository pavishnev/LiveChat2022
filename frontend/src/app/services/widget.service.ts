import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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

  public getWidgetCode():Observable<any>{
    return this.httpClient.get<any>(`${this.widgetApiUrl}/chat-widget/`);
  }

}
