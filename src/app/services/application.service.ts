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

  public getByName(name: string): Observable<Application> {
    return this.httpClient.get<Application>(`${this.apiPrefix}name/${name}`);
  }

  public save(instrument: Application): Observable<Application> {
    const params = JSON.stringify(instrument);
    return this.httpClient.post<Application>(`${this.apiPrefix}`, params, { headers: this.headers });
  }

  public delete(instrument: Application) {
    return this.httpClient.delete<Application>(`${this.apiPrefix}${instrument.id}`);
  }


  public getAppMessage(msg: string) {
    let output = "";
    const env = (window as any).env;
    const messages = env && env.messages ? env.messages : null;

    if (messages && Object.prototype.hasOwnProperty.call(messages, msg)) {
      output = messages[msg];
    }

    return output;
  }

}
