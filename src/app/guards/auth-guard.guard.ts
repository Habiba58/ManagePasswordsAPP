import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';
@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: UserAuthService
              , private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isUserLogged)
      return true;
    else{
      alert('You Must Login First!');
      this.router.navigate(['/Login']);
      return false;
    }
     
  };

}

