import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isUserLogged: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';
  @ViewChild("pass") passwordInput: ElementRef = {} as ElementRef;
  constructor(private authService: UserAuthService
    , private router: Router) { }
  ngOnInit(): void {
    this.isUserLogged = this.authService.isUserLogged;
    console.log('onInit', this.isUserLogged)
  }
  togglePassword() {
    const togglePasswords = document.getElementById('togglePassword');
    const type = this.passwordInput.nativeElement.getAttribute('type') === 'password' ? 'text' : 'password';
    this.passwordInput.nativeElement.setAttribute('type', type);
    togglePasswords?.classList.toggle('fa-eye-slash');
  }
  login(email: string, password: string) {
    this.authService.authUser(email, password);
    this.isUserLogged = this.authService.isUserLogged;
    console.log(this.isUserLogged);
    if (this.isUserLogged == false) {
      console.log('inside if')
      this.errorMessage = 'Wrong Email Or Password!';
      this.isError = true;
      setTimeout(() => this.isError = false, 2500);
    }
    else {
      this.router.navigate(['/Sites']);
    }

  }

}
