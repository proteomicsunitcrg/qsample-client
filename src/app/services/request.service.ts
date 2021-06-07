import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { MiniRequest } from '../models/MiniRequest';
import { Application } from '../models/Application';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  apiPrefix: string = environment.apiPrefix;
  public currentRequestCode = new Subject<string>();

  public currentApplication = new Subject<Application>();

  params = new HttpParams();

  public changeRequestCode(value: string) {
    this.currentRequestCode.next(value);
  }

  public changeCurrentApplication(value: Application) {
    this.currentApplication.next(value);
  }



  public getAllRequestsInternal(showAll: boolean, startDate: Date, endDate: Date): Observable<MiniRequest[]> {
    this.params = this.params.set('showAll', showAll ? 'true' : 'false');
    this.params = this.params.set('start_date', startDate.toISOString());
    this.params = this.params.set('end_date', endDate.toISOString());
    return this.http.get<MiniRequest[]>(`${this.apiPrefix}api/request`, { params: this.params });
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
