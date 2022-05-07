import { WidgetService } from './../../../services/widget.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard'
import { Router } from '@angular/router';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  constructor(
    private router: Router,
      // private agentsAuthService:AgentsAuthService,
       private clipboard: Clipboard,
       private snackbar: MatSnackBar,
       private widgetService:WidgetService
  ) { }

 cssCode!:string;
 jsCode!:string;
  ngOnInit() {
    this.widgetService.getWidgetCode().subscribe(data=>{
      this.cssCode=data.cssCode;
      this.jsCode=data.jsCode;
    }, (error) =>{
       var ex = error.error;
      if(error.status===0){
           this.snackbar.open("Error occured while connecting to server. Please check your internet connection or try later", 'OK', {duration: 3000})
       }
       else if(ex.statusCode===400){
         this.snackbar.open(ex.message, 'OK', {duration: 3000})    
       }
       else {
          console.log(error);    
       }
     });
  }
  public copyToClipboard(data:string){
      this.clipboard.copy(data);
      this.snackbar.open("Chat widget code copied to clipboard","Ok",{duration:3000})
    }
  
}
