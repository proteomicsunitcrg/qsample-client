import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Instrument } from '../models/Instrument';
// import { InjectionCondition } from '../models/InjectionCondition';

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  constructor(private httpClient: HttpClient) {}

  apiPrefix: string = environment.apiPrefix + 'api/instrument/';

  headers = new HttpHeaders().set('Content-type', 'application/json');

  public getAll(): Observable<Instrument[]> {
    return this.httpClient.get<Instrument[]>(`${this.apiPrefix}`);
  }

  public getById(id: number): Observable<Instrument> {
    return this.httpClient.get<Instrument>(`${this.apiPrefix}${id}`);
  }

  public save(instrument: Instrument): Observable<Instrument> {
    const params = JSON.stringify(instrument);
    return this.httpClient.post<Instrument>(`${this.apiPrefix}`, params, { headers: this.headers });
  }

  public delete(instrument: Instrument) {
    return this.httpClient.delete<Instrument>(`${this.apiPrefix}${instrument.id}`);
  }
}
