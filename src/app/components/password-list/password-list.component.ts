import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from 'src/app/services/password-manager.service';
import { passwordListHolder } from 'src/app/views/passwordListHolder';
import { siteListHolder } from 'src/app/views/siteListHolder';

import { AES, enc } from 'crypto-js';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.scss']
})
export class PasswordListComponent implements OnInit {
  addNewPasswordForm: FormGroup;
  currentIndex: number = 0;
  newPasswordFormState: string = "Add New";
  isVisible: boolean = false;
  newPasswordFormMessage: string = '';
  currentSiteId: number = 0;
  currentSite: siteListHolder = {} as siteListHolder;
  passwordList: passwordListHolder[] = [];
  filteredPasswordList: passwordListHolder[] = [];
  newPassword: passwordListHolder = {} as passwordListHolder;
  encryptionState: string = 'Decrypt';
  decryptedPassword: string = '';
  @ViewChild("Email") emailInput: ElementRef = {} as ElementRef;
  @ViewChild("userName") userNameInput: ElementRef = {} as ElementRef;
  @ViewChild("pass") passwordInput: ElementRef = {} as ElementRef;
  constructor(private FB: FormBuilder
    , private activateRoute: ActivatedRoute
    , private passManager: PasswordManagerService) {
    this.addNewPasswordForm = FB.group({
      email: ['', [Validators.required, Validators.pattern('.{3,}@(gmail|yahoo|icloud).com')]],
      username: FB.control('', [Validators.required]),
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((paramMap) => {
      this.currentSiteId = Number(paramMap.get('sID'));
      this.passManager.getSiteByID(this.currentSiteId).subscribe((site: siteListHolder) => {
        this.currentSite = site;
      })
    });
    this.loadPasswordsBySiteID();
  }
  togglePassword() {
    const togglePasswords = document.getElementById('togglePassword');
    const type = this.passwordInput.nativeElement.getAttribute('type') === 'password' ? 'text' : 'password';
    this.passwordInput.nativeElement.setAttribute('type', type);
    togglePasswords?.classList.toggle('fa-eye-slash');
  }
  loadAllPassword() {
    this.passManager.getAllPasswords().subscribe((passwords: passwordListHolder[]) => {
      this.passwordList = passwords;
    });
  }
  loadPasswordsBySiteID() {
    this.passManager.getPasswordsBySiteID(this.currentSiteId).subscribe((filteredPasswords: passwordListHolder[]) => {
      this.filteredPasswordList = filteredPasswords;
    });
  }
  get email() {
    return this.addNewPasswordForm.get('email')
  }
  get username() {
    return this.addNewPasswordForm.get('username');
  }
  get password() {
    return this.addNewPasswordForm.get('password');
  }
  clearForm() {
    this.emailInput.nativeElement.value = "";
    this.userNameInput.nativeElement.value = "";

    this.passwordInput.nativeElement.value = "";
  }
  genralSubmit() {
    if (this.newPasswordFormState == 'Add New') {
      this.submitPassword();
    }
    else if (this.newPasswordFormState == 'Edit') {
      this.submitEditedPassword(this.currentIndex);
    }

  }
  submitPassword() {
    const observer = {
      next: (password: passwordListHolder) => {
        this.newPasswordFormMessage = 'Password Added Successfully!';
        this.isVisible = true;
        setTimeout(() => this.isVisible = false, 2500);
        this.loadPasswordsBySiteID();
        this.clearForm();
      }
    }
    this.newPassword = <passwordListHolder>this.addNewPasswordForm.value;
    this.newPassword.siteID = this.currentSiteId;
    this.newPassword.password = this.encryptPassword(this.addNewPasswordForm.get('password')?.value);
    this.passManager.addNewPassword(this.newPassword).subscribe(observer);
  }
  editPassword(index: number) {
    this.passManager.getPasswordByID(index).subscribe((password: passwordListHolder) => {
      this.addNewPasswordForm.setValue({
        email: password.email,
        username: password.username,
        password: this.decryptPassword(password.password)
      });
    });
    this.newPasswordFormState = 'Edit';
    this.currentIndex = index;
  }
  submitEditedPassword(ID: number) {
    let editedsite = <passwordListHolder>this.addNewPasswordForm.value;
    editedsite.siteID = this.currentSiteId;
    editedsite.password = this.encryptPassword(this.addNewPasswordForm.get('password')?.value);
    this.passManager.editPassword(ID, editedsite).subscribe((password: passwordListHolder) => {
      this.newPasswordFormMessage = "Site Updated Successfully!";
      this.isVisible = true;
      setTimeout(() => this.isVisible = false, 2500);
      this.loadPasswordsBySiteID();
      this.clearForm();
      this.newPasswordFormState = 'Add New';
    });
  }
  deletePassword(ID: number) {
    this.passManager.deletePasssword(ID).subscribe((password: passwordListHolder) => {
      this.newPasswordFormMessage = "Site Deleted Successfully!!";
      this.isVisible = true;
      setTimeout(() => this.isVisible = false, 2500);
      this.loadPasswordsBySiteID();
    });
  }
  encryptPassword(password: string): string {
    const uniqueKey: string = 'FF1F49EFFBDADDDDB6A717EE4F89E';
    const encryptedPassword = AES.encrypt(password, uniqueKey).toString();
    return encryptedPassword;
  }
  decryptPassword(encryptedPassword: string) {
    const uniqueKey: string = 'FF1F49EFFBDADDDDB6A717EE4F89E';
    const decryptedPassword = AES.decrypt(encryptedPassword, uniqueKey).toString(enc.Utf8);
    return decryptedPassword;
  }
  onDecrypt(event: any, index: number, password: string) {
    console.log(password);
    if (event.target.innerHTML == 'Decrypt') {
      let decryptedPassword = this.decryptPassword(this.filteredPasswordList[index].password);
      this.filteredPasswordList[index].password = decryptedPassword;
      event.target.innerHTML = 'Encrypt';
    }
    else if (event.target.innerHTML == 'Encrypt') {
      let encryptedPassword = this.encryptPassword(password);
      this.filteredPasswordList[index].password = encryptedPassword;
      event.target.innerHTML = 'Decrypt';
    }
  }

}
