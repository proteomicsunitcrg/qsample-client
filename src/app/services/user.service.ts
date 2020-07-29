import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.userUrl}`);
  }
}
