import { InviteComponent } from './auth/invite/invite.component';
import { ViewAgentComponent } from './layouts/admin-layout/agents-management/view-agent/view-agent.component';
import { AddAgentComponent } from './layouts/admin-layout/agents-management/add-agent/add-agent.component';
import { AgentsManagementComponent } from './layouts/admin-layout/agents-management/agents-management.component';
import { ChatCardComponent } from './layouts/admin-layout/chats-history/chat-card/chat-card.component';
import { WidgetComponent } from './layouts/admin-layout/widget/widget.component';
import { ChatsHistoryComponent } from './layouts/admin-layout/chats-history/chats-history.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from "./layouts/agent-layout/chat/chat.component";
import { AuthComponent } from "./auth/auth.component";
import { ErrorComponent } from "./error/error.component";
import { RouteGuardService } from './services/route-guard.service';

export const adminRoutes: Routes=[     
            {
                path: '',
                redirectTo: "admin/chats-history",
                pathMatch: 'full'
            }, 
            {
                path: 'chats-history', 
                component: ChatsHistoryComponent
                
            },
            {
                path: 'chats-history/:id',
                //outlet: 'admin-layout',
                component: ChatCardComponent
            },
            {
                path: 'widget',
                component: WidgetComponent
            },
            {
                path: 'agents-management',
                component: AgentsManagementComponent
            },
            {
                path: 'agents-management/add-agent',
                component: AddAgentComponent
            },
             {
                path: 'agents-management/:id',
                component: ViewAgentComponent
            },
         
        ];

export const routes: Routes = [
  { path: '', redirectTo: "/auth", pathMatch: 'full' },
  { path: 'complete-registration/:id', component: InviteComponent },
  { path: 'auth',
   component: AuthComponent,
    data: { onlyAnonymous: true},
    canActivate: [
      RouteGuardService
    ],},

  { path: 'admin', 
  component: AdminLayoutComponent, 
  children:adminRoutes,
      data: {
      onlyAuthorizedAdmin: true
    },
    canActivate: [
      RouteGuardService
    ],},
    
  { path: 'agent/chats', 
    component: ChatComponent,
    data: {
      onlyAuthorizedAgent: true
    },
    canActivate: [
      RouteGuardService
    ],},
  { path: '404', component: ErrorComponent },
  { path: '**', redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true}) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
