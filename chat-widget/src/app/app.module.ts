import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChatComponent } from './chat/chat.component';

import { createCustomElement } from "@angular/elements";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SESSION_TOKEN } from './services/auth.service';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenInterceptor } from './interceptors/token.interceptor';

function tokenGetter(): string|null { 
  return localStorage.getItem(SESSION_TOKEN);
}

@NgModule({
  declarations: [ChatComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.allowedApiDomainsAuth,
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  entryComponents: [ChatComponent],
})
export class AppModule {
  constructor(private _injector: Injector) {}

  ngDoBootstrap() {
    const el = createCustomElement(ChatComponent, { injector: this._injector });
    customElements.define('livechat2021-chat', el);
  }
}
