import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { MiniRequest } from '../models/MiniRequest';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  public currentRequestCode = new Subject<string>();

  public changeRequestCode(value: string) {
    this.currentRequestCode.next(value);
}


  apiPrefix: String = environment.apiPrefix;

  public getAllRequests(): Observable<MiniRequest[]> {
    return this.http.get<MiniRequest[]>(`${this.apiPrefix}api/request`);
  }

  public getRequestDetails(requestId: string): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request/${requestId}`);
  }
}
