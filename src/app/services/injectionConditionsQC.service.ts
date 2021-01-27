import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Instrument } from '../models/Instrument';
import { InjectionConditionQC } from '../models/InjectionConditionQC';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InjectionConditionQCService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/injectionConditionsQC/';

  headers = new HttpHeaders().set('Content-type', 'application/json');


  public findInjectionConditionQCByQCTypeAndInstrument(instrument: Instrument, qcType: string): Observable<InjectionConditionQC> {
    return this.httpClient.get<InjectionConditionQC>(`${this.apiPrefix}getByInstrumentIdAndQCType/${instrument.id}/${qcType}`);
  }


  public saveInjectionCondition(condition: InjectionConditionQC): Observable<InjectionConditionQC> {
    const params = JSON.stringify(condition);
    return this.httpClient.post<InjectionConditionQC>(`${this.apiPrefix}`, params, { headers: this.headers });
  }

  public deleteInjectionConditionQC(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiPrefix}${id}`);
  }

  // errorHandler(error: HttpErrorResponse) {
  //   // console.log(error);
  //   return throwError(error || 'Server Error');
  // }

}
