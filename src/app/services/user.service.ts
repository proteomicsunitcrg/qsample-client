import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  private apiPrefix = environment.apiPrefix;
  private userUrl = this.apiPrefix + 'api/user';
  private currentUserUrl = this.apiPrefix + 'api/user/current';

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

  // TODO: Pending backend to be created
  public addUser(user: User): Observable<User> {
    const params = JSON.stringify(user);
    return this.httpClient.post<User>(`${this.apiPrefix}/auth/addUser`, params, this.httpOptions);
  }


}
