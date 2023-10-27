import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { MiniRequest } from '../models/MiniRequest';
import { Application } from '../models/Application';
import { RequestLocal } from '../models/RequestLocal';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  apiPrefix: string = environment.apiPrefix;
  public currentRequestCode = new Subject<string>();

  public currentApplication = new Subject<Application>();

  params = new HttpParams();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

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

  public getRequestDetails(requestId: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request/${requestId}`);
  }

  public getRequestDetailsByRequestCode(requestCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request/getByRequestCode/${requestCode}`);
  }

  public getRequestPlotName(csId: number, paramId: string): Observable<string> {
    const requestOptions: object = {
      /* other options here */
      responseType: 'text',
    };
    return this.http.get<string>(`${this.apiPrefix}api/request/getPlotName/${csId}/${paramId}`, requestOptions);
  }

  public isQcloud2FilesEnabled(): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request/isQCloud2FilesEnabled`);
  }

  public getLocalRequestById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request/getLocalById/${id}`);
  }

  public saveLocalRequest(requestLocal: RequestLocal): Observable<RequestLocal> {
    const params = JSON.stringify(requestLocal);
    return this.http.post<any>(`${this.apiPrefix}api/request/saveLocal`, params, this.httpOptions);
  }

  public deleteLocalRequest(requestLocal: RequestLocal): Observable<RequestLocal> {
    return this.http.delete<any>(`${this.apiPrefix}api/request/deleteLocal/${requestLocal.id}`, this.httpOptions);
  }

  public getIsLocalModeEnabled(): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}api/request/localMode`);
  }
}
