import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QCtype } from '../models/QCtype';

@Injectable({
  providedIn: 'root',
})
export class QCtypeService {
  constructor(private httpClient: HttpClient) {}

  apiPrefix: string = environment.apiPrefix + 'api/qctype/';

  headers = new HttpHeaders().set('Content-type', 'application/json');

  public getAll(): Observable<QCtype[]> {
    return this.httpClient.get<QCtype[]>(`${this.apiPrefix}`);
  }

  public getById(id: number): Observable<QCtype> {
    return this.httpClient.get<QCtype>(`${this.apiPrefix}${id}`);
  }

  public save(qctype: QCtype): Observable<QCtype> {
    const params = JSON.stringify(qctype);
    return this.httpClient.post<QCtype>(`${this.apiPrefix}`, params, { headers: this.headers });
  }

  public delete(qctype: QCtype) {
    return this.httpClient.delete<QCtype>(`${this.apiPrefix}${qctype.id}`);
  }
}
