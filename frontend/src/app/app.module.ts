// Angular imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { ChatComponent } from './layouts/agent-layout/chat/chat.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ChatCardComponent } from './layouts/admin-layout/chats-history/chat-card/chat-card.component';
import { ChatsHistoryComponent } from './layouts/admin-layout/chats-history/chats-history.component';
import { AuthComponent } from './auth/auth.component';
import { ErrorComponent } from './error/error.component';
import { AgentsManagementComponent } from './layouts/admin-layout/agents-management/agents-management.component';
import { AddAgentComponent } from './layouts/admin-layout/agents-management/add-agent/add-agent.component';
import { DialogOverviewExampleDialog, ViewAgentComponent } from './layouts/admin-layout/agents-management/view-agent/view-agent.component';
import { InviteComponent } from './auth/invite/invite.component';
import { WidgetComponent } from './layouts/admin-layout/widget/widget.component';

// Other modules
import { AppRoutingModule } from "./app-routing.module";
import { ACCESS_TOKEN_KEY } from './services/auth.service';
import { environment } from 'src/environments/environment';

// Angular Material Modules
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {MatDialogModule} from '@angular/material/dialog';
import { TokenInterceptor } from './interceptors/token.interceptor';
///

export function tokenGetter(): string|null {
   return localStorage.getItem(ACCESS_TOKEN_KEY)
}

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    AdminLayoutComponent,
    ChatsHistoryComponent,
    ChatCardComponent,
    WidgetComponent,
    AgentsManagementComponent,
    AddAgentComponent,
    ViewAgentComponent,
    DialogOverviewExampleDialog,
    InviteComponent,
    ErrorComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatTableModule,
    MatListModule,
    MatTabsModule,
    MatDialogModule,
    
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.allowedApiDomainsAuth,
      },
    }),
    MatSlideToggleModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
