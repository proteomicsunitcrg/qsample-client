import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) { }

  apiPrefix: String = environment.apiPrefix;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  public login(user: String, password: String): Observable<any> {
    return this.http.post<any>(`${this.apiPrefix}api/auth/signin`, {username: user, password: password}, this.httpOptions);
  }
}
