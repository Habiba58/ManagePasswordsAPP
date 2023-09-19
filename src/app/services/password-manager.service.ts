import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { siteListHolder } from '../views/siteListHolder';
import { passwordListHolder } from '../views/passwordListHolder';
import { userListHolder } from '../views/userListHolder';

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerService {
  APILink: string = 'http://localhost:3000';
  httpOptions;
  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }
  getAllSites(): Observable<siteListHolder[]> {
    return this.httpClient.get<siteListHolder[]>(`${this.APILink}/sites`);
  }
  getSiteByID(siteID: number): Observable<siteListHolder> {
    return this.httpClient.get<siteListHolder>(`${this.APILink}/sites/${siteID}`);
  }
  addNewSite(newSite: siteListHolder): Observable<siteListHolder> {
    return this.httpClient.post<siteListHolder>(`${this.APILink}/sites`, JSON.stringify(newSite), this.httpOptions);
  }
  deleteSite(siteID: number): Observable<siteListHolder> {
    return this.httpClient.delete<siteListHolder>(`${this.APILink}/sites/${siteID}`);
  }
  editSite(siteID: number, editedSite: siteListHolder): Observable<siteListHolder> {
    console.log("inside edit", siteID, editedSite);
    return this.httpClient.put<siteListHolder>(`${this.APILink}/sites/${siteID}`, JSON.stringify(editedSite), this.httpOptions);
  }
  getAllPasswords(): Observable<passwordListHolder[]> {
    return this.httpClient.get<passwordListHolder[]>(`${this.APILink}/passwords`);
  }
  getPasswordByID(ID: number): Observable<passwordListHolder> {
    return this.httpClient.get<passwordListHolder>(`${this.APILink}/passwords/${ID}`);
  }
  addNewPassword(newPassword: passwordListHolder): Observable<passwordListHolder> {
    return this.httpClient.post<passwordListHolder>(`${this.APILink}/passwords`, JSON.stringify(newPassword), this.httpOptions);
  }
  editPassword(passwordID: number, editedPassword: passwordListHolder): Observable<passwordListHolder> {
    return this.httpClient.put<passwordListHolder>(`${this.APILink}/passwords/${passwordID}`, JSON.stringify(editedPassword), this.httpOptions);
  }
  deletePasssword(passwordID: number): Observable<passwordListHolder> {
    return this.httpClient.delete<passwordListHolder>(`${this.APILink}/passwords/${passwordID}`);
  }
  getPasswordsBySiteID(siteID:number):Observable<passwordListHolder[]>{
    return this.httpClient.get<passwordListHolder[]>(`${this.APILink}/passwords/?siteID=${siteID}`)
  }
  getAllUsers():Observable<userListHolder[]>{
    return this.httpClient.get<userListHolder[]>(`${this.APILink}/users`);
  }

}
