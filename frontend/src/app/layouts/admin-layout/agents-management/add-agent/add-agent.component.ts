import { AgentsAuthService } from './../../../../services/agents-auth.service';
import { UserId } from './../../../../interfaces/user-id.interface';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common'
import { tap } from 'rxjs/operators';
import { OnlineService } from 'src/app/services/online.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
  hide = true;
  constructor(
    private authService: AgentsAuthService, 
    private snackbar: MatSnackBar,
    private router: Router,
    private location: Location,
  private onlineService: OnlineService) {
    }

  ngOnInit() {
  }
    loginForm = new FormGroup
  ({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required])
  });

     submit(){
       if(this.loginForm.get('email')?.invalid == false && 
          this.loginForm.get('name')?.invalid == false) {
     // console.log(this.loginForm.value)
      this.authService.signUpAgent(this.loginForm.value)
        .subscribe(
          (data: UserId) => {
         //     console.log(data);
         // this.router.navigate([`admin/agents-management/${data.userId}`])

         this.router.navigate([`admin/agents-management/${data.userId}`])
           this.snackbar.open("Successfully added new agent. Copy invitation link and send him", 'OK', {duration: 3000}) 
          },
              (error) =>{
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

        }
     }


    getErrorMessage() {
    if (this.loginForm.hasError('required', 'email') ||
        this.loginForm.hasError('required', 'name'))
    {
      return 'This field is required to fill in';
    }

    return this.loginForm.hasError('email', 'email') ? 'Invalid email format' : '';
  }
}
