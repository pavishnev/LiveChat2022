import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { HttpService } from "../../services/http.service";
import { LoginModel } from "../../models/login.model";
import { OnlineService } from 'src/app/services/online.service';

@Component
({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [HttpService]
})

export class LoginComponent
{
  constructor(
    private authService: AuthService, 
    private snackbar: MatSnackBar,
    private router: Router, 
    private onlineService: OnlineService) {
    }

  // Email and password FormControl validators
  loginForm = new FormGroup
  ({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  // Login credentials model
 // loginCredentials: LoginModel = new LoginModel("", "");

  // TO-DO: create user data model of implement JWT token
  receivedData: string | undefined;

  // Boolean for success server response after login form submit
  done: boolean = false;

  // Sending login credentials to the server
  submit()
  {
    if(this.loginForm.get('email')?.invalid == false && 
    this.loginForm.get('password')?.invalid == false) {
      this.authService.signIn(this.loginForm.value)
        .subscribe(
          (data: any) => {
           // this.receivedData = data;
           //console.log(data);
           this.authService.isUserAuthorizedGetter;
           if(this.authService.isUserAuthorizedAsAgent)
           {
             this.onlineService.addAgentOnline();
           }
           this.authService.routeToAllowedLayout();
            this.done = true;
            
          },
             (error) =>{
            var ex = error.error;
            if(error.status===0){
                this.snackbar.open("Error occured while connecting to server. Please check your internet connection or try later", 'OK', {duration: 3000})
            }
            else if(ex.statusCode===400){
                this.snackbar.open(ex.message, 'OK', {duration: 3000})    
            }
          })
    }
    else
    {
      this.loginForm.markAllAsTouched();
     // this.loginForm.get('email')?.markAsTouched();
     // this.loginForm.get('password')?.markAsTouched();
     this.snackbar.open("Please, fill all the fields correctly", 'OK', {duration: 3000})  
    }
  }

  hide = true;

  getErrorMessage() {
    if (this.loginForm.hasError('required', 'email') ||
        this.loginForm.hasError('required', 'password'))
    {
      return 'This field is required to fill in';
    }

    return this.loginForm.hasError('email', 'email') ? 'Invalid email format' : '';
  }
}
