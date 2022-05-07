
import { AgentsAuthService } from 'src/app/services/agents-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentsTableElement } from 'src/app/interfaces/agents-table-element.interface';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {Clipboard} from '@angular/cdk/clipboard'
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-agent',
  templateUrl: './view-agent.component.html',
  styleUrls: ['./view-agent.component.css']
})
export class ViewAgentComponent implements OnInit {
  private routeSubscription: Subscription;

  id!:string;
  name!:string;
  email!:string;
  status!:string;
  CompletedChatsCount!:number;
  invitationLink!:string;
  isInvited=false;
  isExpired=false;

 constructor( 
      private route: ActivatedRoute,
       private router: Router,
       private agentsAuthService:AgentsAuthService,
       private clipboard: Clipboard,
       private snackbar: MatSnackBar,
       private dialog:MatDialog
    ) { 
      this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
        this.routeSubscription = route.queryParams.subscribe(
            (queryParam: any) => {
               // this.name = queryParam['name'];
            }
        );    
    }
    public copyToClipboard(){
      this.clipboard.copy(this.invitationLink);
      this.snackbar.open("Invitation link copied to clipboard","Ok",{duration:3000})
    }
  
    public goToParent(){
        //this.location.back();
        this.router.navigate([`admin/agents-management/`])
    }
     openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {id: this.id}
    });

  }
  ngOnInit() {
    this.agentsAuthService.getAgentCredentials(this.id).subscribe(data=>{
    this.name=data.name;
    this.email = data.email;
    this.status=data.status;
    this.CompletedChatsCount=data.completedChatsCount;
     if(data.invitationCode==null && this.status=="Active") {
       this.isInvited=false;
       this.isExpired=false;
    }
     else if(data.invitationCode==null && this.status=="Waiting for approval"){
        this.isInvited=false;
        this.isExpired=true;
     }
     else {
       this.invitationLink = environment.url+ "complete-registration/"+ data.invitationCode
        this.isInvited=true;
        this.isExpired=false;
     }
    });


  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title>Are you sure? </h1>
<div mat-dialog-actions>
  <button mat-raised-button color="primary" (click)="onNoClick()">Cancel</button>
  <button mat-raised-button color="warn" (click)="deleteAgent()">Delete Agent</button>
</div>`,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private router:Router,
    private agentsAuthService:AgentsAuthService,
    private snackbar:MatSnackBar,
     @Inject(MAT_DIALOG_DATA) public data: any)
     {}

  onNoClick(): void {
    this.dialogRef.close();
  }
    public deleteAgent(){
      this.agentsAuthService.deleteAgent(this.data.id).subscribe(data=>{
         this.router.navigate(["admin/agents-management"]);
        this.dialogRef.close();
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
           })
       // console.log(this.data.id);
 
    }

}