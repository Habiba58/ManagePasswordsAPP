import { Injectable } from '@angular/core';
import { PasswordManagerService } from './password-manager.service';
import { userListHolder } from '../views/userListHolder';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private isLoggedSubject: BehaviorSubject<boolean>;
  emails: string[] = [];
  passwords: string[] = [];
  constructor(private passManager: PasswordManagerService) {
    this.isLoggedSubject = new BehaviorSubject<boolean>(false);
    this.passManager.getAllUsers().subscribe((users: userListHolder[]) => {
      this.emails = users.map(user => user.email);
      this.passwords = users.map(user => user.password);
    });
  }
  authUser(email: string, password: string) {
    let index: number = this.emails.indexOf(email);
    if (this.emails.includes(email) && password == this.passwords[index]) {
      console.log("inside if")
      let userToken = '123456789';// handeled statically for now.
      localStorage.setItem('token', userToken);
      this.isLoggedSubject.next(true);
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.isLoggedSubject.next(false);
  }
  get isUserLogged(): boolean {
    return ((localStorage.getItem('token')) ? true : false);
  }
}
