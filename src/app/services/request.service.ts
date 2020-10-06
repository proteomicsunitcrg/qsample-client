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

  apiPrefix: string = environment.apiPrefix;
  public currentRequestCode = new Subject<string>();

  public changeRequestCode(value: string) {
    this.currentRequestCode.next(value);
  }



  public getAllRequestsInternal(): Observable<MiniRequest[]> {
    return this.http.get<MiniRequest[]>(`${this.apiPrefix}api/request`);
  }

  public getAllRequestsExternal(): Observable<MiniRequest[]> {
    return this.http.get<MiniRequest[]>(`${this.apiPrefix}api/request/external`);
  }

  public getRequestDetails(requestId: string): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request/${requestId}`);
  }

  public getRequestPlotName(csId: number, paramId: string): Observable<string> {
    const requestOptions: object = {
      /* other options here */
      responseType: 'text'
    };
    return this.http.get<string>(`${this.apiPrefix}api/request/getPlotName/${csId}/${paramId}`, requestOptions);
  }
}
