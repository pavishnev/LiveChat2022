import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { routes } from '../app-routing.module';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

constructor( private router: Router,
    private authService: AuthService,
    private snackbar:MatSnackBar) { }

 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   
  if (route.data.onlyAuthorizedAdmin) {
    console.log(route.data
)
      if (this.authService.isUserAuthorizedAsAdmin)  return true;
      else {
        this.authService.routeToAllowedLayout();
        this.snackbar.open('Login as administrator, please',"Ok",{duration: 5000});
        return false;
      }
    }

    else if (route.data.onlyAuthorizedAgent) {
      if (this.authService.isUserAuthorizedAsAgent) return true;
       else {
        this.authService.routeToAllowedLayout();
        this.snackbar.open('Login as agent, please',"Ok",{duration: 5000});
        return false;
      }
    }

  else if (route.data.onlyAnonymous) {
      if (!this.authService.isUserAuthorizedGetter) {
        return true;
      } else {
        this.authService.routeToAllowedLayout();
        this.snackbar.open('You are already signed in',"Ok",{duration: 5000});
        return false;
      }
    }
    else return false;
  }
}
