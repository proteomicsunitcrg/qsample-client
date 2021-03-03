import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { MiniRequest } from '../models/MiniRequest';

@Injectable({
  providedIn: 'root'
})
export class QuantificationService {

  constructor(private http: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/quantification';

  params = new HttpParams();


  public getQuantificationByFileChecksumAndContaminant(checksum: string, contaminant: boolean): Observable<any> {
    this.params = this.params.set('contaminant', String(contaminant));
    return this.http.get<any>(`${this.apiPrefix}/getByChecksum/${checksum}`, { params: this.params });
  }

}
