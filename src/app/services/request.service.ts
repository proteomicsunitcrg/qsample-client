import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  apiPrefix: String = environment.apiPrefix;
  
  public getAllRequests(): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request`);
  }
}
