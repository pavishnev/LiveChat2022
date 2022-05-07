import { AgentRegisterComplete } from './../../interfaces/agent-register-complete.interface';
import { AgentsAuthService } from 'src/app/services/agents-auth.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComparePassword } from '../register/match.validator';
import { JWTtoken } from 'src/app/interfaces/JWTtoken.interface';
import { OnlineService } from 'src/app/services/online.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  private routeSubscription: Subscription;
  hide: boolean = true;
  registerForm: FormGroup;
  id!:string;
  form:AgentRegisterComplete={
    invitationCode:"",
    password:""
  }


  get f() { return this.registerForm.controls; }
  constructor(
     private formBuilder: FormBuilder,
     private snackbar: MatSnackBar,
     private authService: AuthService, 
     private route: ActivatedRoute,
     private onlineServie: OnlineService
  ) { 
       this.routeSubscription = route.params.subscribe(params=>this.id=params['id']);
        this.routeSubscription = route.queryParams.subscribe(
            (queryParam: any) => {
               // this.name = queryParam['name'];
            }
        );   
    this.registerForm = this.formBuilder.group(
      {
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },  {
        // Used custom form validator name
        validator: ComparePassword("password", "confirmPassword")
      }) }

    submit(){
if(
     this.registerForm.get('password')?.invalid == false &&
     this.registerForm.get('confirmPassword')?.invalid == false) {
       this.form.invitationCode=this.id;
       this.form.password=this.registerForm.get("password")?.value;
     this.authService.signUpAgentComplete(this.form)
       .subscribe(
         (data: JWTtoken) => {
           console.log(data);
           this.authService.isUserAuthorizedGetter;
           this.authService.routeToAllowedLayout();
           this.onlineServie.addAgentOnline();
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
  ngOnInit() {
  }

}
