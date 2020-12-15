import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Application } from '../models/Application';
import { Method } from '../models/Method';

@Injectable({
  providedIn: 'root'
})
export class MethodService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/method/';

  headers = new HttpHeaders().set('Content-type', 'application/json');



  public getAll(): Observable<Method[]> {
    return this.httpClient.get<Method[]>(`${this.apiPrefix}`);
  }

  public getById(id: number): Observable<Method> {
    return this.httpClient.get<Method>(`${this.apiPrefix}${id}`);
  }

  public save(instrument: Method): Observable<Method> {
    const params = JSON.stringify(instrument);
    return this.httpClient.post<Method>(`${this.apiPrefix}`, params, { headers: this.headers });
  }

  public delete(instrument: Method) {
    return this.httpClient.delete<Method>(`${this.apiPrefix}${instrument.id}`);
  }


}
