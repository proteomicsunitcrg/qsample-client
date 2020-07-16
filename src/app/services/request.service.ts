import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MiniRequest } from '../models/MiniRequest';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  apiPrefix: String = environment.apiPrefix;
  
  public getAllRequests(): Observable<MiniRequest[]> {
    return this.http.get<MiniRequest[]>(`${this.apiPrefix}api/request`);
  }
}
