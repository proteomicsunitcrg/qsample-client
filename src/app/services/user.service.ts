import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { UserCreation } from '../models/UserCreation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  private apiPrefix = environment.apiPrefix;
  private userUrl = this.apiPrefix + 'api/user';
  private currentUserUrl = this.apiPrefix + 'api/user/current';
  private authUrl = this.apiPrefix + 'api/auth';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.userUrl}`);
  }

  public getCurrentUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.currentUserUrl}`);
  }

  public modifyRole(user: User, to: string): Observable<User> {
    const params = JSON.stringify(user);
    return this.httpClient.post<User>(`${this.userUrl}/modifyRole/${to}`, params, this.httpOptions);
  }

  public addUser(user: UserCreation): Observable<User> {
    const params = JSON.stringify(user);
    return this.httpClient.post<User>(`${this.authUrl}/addUser`, params, this.httpOptions);
  }


}
