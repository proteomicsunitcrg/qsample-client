import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private isInternal = new BehaviorSubject<boolean>(false);

  private isAdmin = new BehaviorSubject<boolean>(false);

  apiPrefix: String = environment.apiPrefix;

  public updateIsInternal(value: boolean) {
    this.isInternal.next(value);
  }

  public updateIsAdmin(value: boolean) {
    this.isAdmin.next(value);
  }

  public getIsInternal(): Observable<boolean> {
    return this.isInternal.asObservable();
  }

  public getIsAdmin(): Observable<boolean> {
    return this.isAdmin.asObservable();
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public login(user: String, password: String): Observable<any> {
    return this.http.post<any>(`${this.apiPrefix}api/auth/signin`, {username: user, password: password}, this.httpOptions);
  }
}
