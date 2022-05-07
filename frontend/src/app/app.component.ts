import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription,interval } from 'rxjs';
import { ACCESS_TOKEN_KEY, AuthService } from './services/auth.service';
import { SignalRService } from './services/signal-r.service';
import { OnlineService } from './services/online.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
     subscription: Subscription;
    isUserAuthorized:boolean=false;

  
// Subscribe to begin publishing values
  constructor(
    public signalRService: SignalRService, 
    private http: HttpClient,
    private snackbar: MatSnackBar,
    public authService:AuthService,
    private onlinService:OnlineService) {
      this.subscription = authService.boolObserved$.subscribe(
        bool=>this.isUserAuthorized=bool)

        interval(5000).subscribe(n =>{
           const token = localStorage.getItem(ACCESS_TOKEN_KEY);
          if(!this.authService.isUserAuthorizedGetter && token!=undefined){
            if(this.authService.isUserAuthorizedAsAgent)
{
  this.onlinService.removeAgentOnline()
}
            this.authService.signOut();
            this.snackbar.open("Your session has expired. Please sign in again","OK",{duration:3000})
          }
          });
     }

     onChangedMain(bool:any){
        this.isUserAuthorized=bool;
    } 
 
 ngOnInit() {
    this.isUserAuthorized = this.authService.isUserAuthorizedGetter; 
     if(this.authService.isUserAuthorizedGetter)
    {
      this.signalRService.startConnection();
    }
  }

  public signOut():void{
    if(this.authService.isUserAuthorizedAsAgent)
    {
      this.onlinService.removeAgentOnline();
    }
    this.authService.signOut()

    this.isUserAuthorized=false;
  }
}
