import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordManagerService } from 'src/app/services/password-manager.service';
import { passwordListHolder } from 'src/app/views/passwordListHolder';
import { siteListHolder } from 'src/app/views/siteListHolder';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit {
  addSiteForm: FormGroup;
  sites: siteListHolder[] = [];
  formState: string = "Add New";
  isVisible: boolean = false;
  formMessage: string = "";
  currentIndex: number = 0;
  filteredPasswords: passwordListHolder[] = [];
  @ViewChild("sitename") siteNameInput: ElementRef = {} as ElementRef;
  @ViewChild("siteurl") siteURLInput: ElementRef = {} as ElementRef;
  @ViewChild("siteimgURL") siteimgURLInput: ElementRef = {} as ElementRef;
  constructor(private FB: FormBuilder
    , private passManager: PasswordManagerService
    , private router: Router) {
    this.addSiteForm = FB.group({
      siteName: FB.control('', [Validators.required, Validators.pattern('[A-Za-z0-9]{3,}.com')]),
      siteURL: ['', [Validators.required, Validators.pattern('https://.{3,}')]],
      siteImageURL: ['', [Validators.required, Validators.pattern('https://.{3,}')]]
    })
  }
  ngOnInit(): void {
    this.passManager.getAllSites().subscribe((sites: siteListHolder[]) => {
      this.sites = sites;
    })
  }
  get siteName() {
    return this.addSiteForm.get('siteName');
  }
  get siteURL() {
    return this.addSiteForm.get('siteURL');
  }
  get siteImageURL() {
    return this.addSiteForm.get('siteImageURL');
  }
  clearForm() {
    this.siteNameInput.nativeElement.value = "";
    this.siteURLInput.nativeElement.value = "";
    this.siteimgURLInput.nativeElement.value = "";
  }
  loadPasswordsBySiteID(siteID: number) {
    this.passManager.getPasswordsBySiteID(siteID).subscribe((filteredPasswords: passwordListHolder[]) => {
      this.filteredPasswords = filteredPasswords;
    });
  }
  returnPasswords(siteID:number):passwordListHolder[]{
     this.loadPasswordsBySiteID(siteID);
     return this.filteredPasswords;
  }
  genralSubmit() {
    if (this.formState == "Add New") {
      this.submit();
    }
    else if (this.formState == "Edit") {
      this.submitEditedSite(this.currentIndex);
    }
  }
  deleteSite(index: number) {
    this.passManager.deleteSite(index).subscribe((site: siteListHolder) => {
      this.formMessage = "Site Deleted Successfully!!";
      this.isVisible = true;
      setTimeout(() => this.isVisible = false, 2500);
      this.ngOnInit();
    });
  }
  editSite(index: number) {
    this.passManager.getSiteByID(index).subscribe((site: siteListHolder) => {
      this.addSiteForm.setValue({
        siteName: site.siteName,
        siteURL: site.siteURL,
        siteImageURL: site.siteImageURL
      });
    });
    this.formState = "Edit";
    this.currentIndex = index;
  }
  submitEditedSite(index: number) {
    let editedsite = <siteListHolder>this.addSiteForm.value;
    this.passManager.editSite(index, editedsite).subscribe((site: siteListHolder) => {
      this.formMessage = "Site Updated Successfully!";
      this.isVisible = true;
      setTimeout(() => this.isVisible = false, 2500);
      this.ngOnInit();
      this.clearForm();
    });
  }
  submit() {
    const observer = {
      next: (siteList: siteListHolder) => {
        this.formMessage = "Site Addedd Successfully!";
        this.isVisible = true;
        setTimeout(() => this.isVisible = false, 2500);
        this.ngOnInit();
        this.clearForm();
      },
      error: (err: Error) => {
        alert("an error happend");
      }
    }
    let siteList = <siteListHolder>this.addSiteForm.value;
    console.log(typeof (siteList));
    this.passManager.addNewSite(siteList).subscribe(observer);
  }
  addNewPass(index: number) {
    this.router.navigate(['/PasswordList', index])
  }

}
