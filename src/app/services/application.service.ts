import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Application } from '../models/Application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/application/';

  headers = new HttpHeaders().set('Content-type', 'application/json');



  public getAll(): Observable<Application[]> {
    return this.httpClient.get<Application[]>(`${this.apiPrefix}`);
  }

  public getById(id: number): Observable<Application> {
    return this.httpClient.get<Application>(`${this.apiPrefix}${id}`);
  }

  public save(instrument: Application): Observable<Application> {
    const params = JSON.stringify(instrument);
    return this.httpClient.post<Application>(`${this.apiPrefix}`, params, { headers: this.headers });
  }

  public delete(instrument: Application) {
    return this.httpClient.delete<Application>(`${this.apiPrefix}${instrument.id}`);
  }


}
