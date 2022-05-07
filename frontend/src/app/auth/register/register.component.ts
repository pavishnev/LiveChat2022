import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from "../../services/http.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {RegisterModel} from "../../models/register.model";
import { ComparePassword } from './match.validator';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OnlineService } from 'src/app/services/online.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [HttpService]
})
export class RegisterComponent {

  registerForm: FormGroup;
  get f() { return this.registerForm.controls; }

  constructor(
     private router: Router,
     private snackbar: MatSnackBar, 
     private formBuilder: FormBuilder,
     private authService:AuthService,
     private onlineService: OnlineService
     ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        websiteUrl: ["", [Validators.required]],
      },
      {
        // Used custom form validator name
        validator: ComparePassword("password", "confirmPassword")
      }
    );

    
  }

  hide: boolean = true;

  receivedData: string | undefined;

  done: boolean = false;

  submit()
  {
   if(this.registerForm.get('name')?.invalid == false &&
     this.registerForm.get('email')?.invalid == false &&
     this.registerForm.get('password')?.invalid == false &&
     this.registerForm.get('confirmPassword')?.invalid == false &&
     this.registerForm.get('websiteUrl')?.invalid == false) {
      this.authService.signUp(this.registerForm.value)
        .subscribe(
          (data: any) => {
            this.done = true;
            this.authService.isUserAuthorizedGetter;
            this.authService.routeToAllowedLayout();
          },
          (error) =>{
            var ex = error.error
            if(error.status===0){
                this.snackbar.open("Error occured while connecting to server. Please check your internet connection or try later", 'OK', {duration: 3000})
            }
            else if(ex.statusCode===400){
                this.snackbar.open(ex.message, 'OK', {duration: 3000})    
            }
          }   
        );
   }
    else
    {
      this.registerForm.markAllAsTouched();
       this.snackbar.open("Please, fill all the fields correctly", 'OK', {duration: 3000})  
     // console.log("dffdsf");
    }
  }
}
