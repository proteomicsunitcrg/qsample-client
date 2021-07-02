import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { PasswordResetToken } from '../models/PasswordResetToken';
import { User } from '../models/User';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  apiPrefix: string = environment.apiPrefix;


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private isInternal = new BehaviorSubject<boolean>(false);

  private isAdmin = new BehaviorSubject<boolean>(false);

  private isManager = new BehaviorSubject<boolean>(false);


  public updateIsInternal(value: boolean) {
    this.isInternal.next(value);
  }

  public updateIsAdmin(value: boolean) {
    this.isAdmin.next(value);
  }

  public updateIsManager(value: boolean) {
    this.isManager.next(value);
  }

  public getIsInternal(): Observable<boolean> {
    return this.isInternal.asObservable();
  }

  public getIsAdmin(): Observable<boolean> {
    return this.isAdmin.asObservable();
  }

  public getIsManager(): Observable<boolean> {
    return this.isManager.asObservable();
  }


  public login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiPrefix}api/auth/signin`, { username, password }, this.httpOptions);
  }

  public resetPassword(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiPrefix}api/auth/recovery`, { username }, this.httpOptions);
  }

  public getResetToken(token: string): Observable<PasswordResetToken> {
    return this.http.post<PasswordResetToken>(`${this.apiPrefix}api/auth/getToken`, token, this.httpOptions);
  }

  public changePassword(username, password): Observable <User> {
    return this.http.post<User>(`${this.apiPrefix}api/auth/changePassword`, { username, password });
  }
}
