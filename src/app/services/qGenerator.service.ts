import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Instrument } from '../models/Instrument';
// import { InjectionCondition } from '../models/InjectionCondition';
import { InjectionConditionQC } from '../models/InjectionConditionQC';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QGeneratorService {
  constructor(private httpClient: HttpClient) {}

  apiPrefix: string = environment.apiPrefix + 'api/qgenerator/';

  headers = new HttpHeaders().set('Content-type', 'application/json');

  public orderCSV = new Subject<any[]>();

  public sendCSV(list: any[]) {
    this.orderCSV.next(list);
  }

  public getCSV(): Observable<any> {
    return this.orderCSV.asObservable();
  }

  public getAvailableInstruments(appName: string): Observable<Instrument[]> {
    return this.httpClient.get<Instrument[]>(`${this.apiPrefix}available/${appName}`);
  }

  public getInjectionConditionsByInstrumentId(selectedInstrument: Instrument): Observable<InjectionConditionQC[]> {
    return this.httpClient
      .get<InjectionConditionQC[]>(`${this.apiPrefix}getInjectionConditionsByInstrumentId/${selectedInstrument.id}`)
      .pipe(catchError(this.errorHandler));
  }

  // public saveInjectionCondition(condition: InjectionCondition): Observable<InjectionCondition> {
  //   const params = JSON.stringify(condition);
  //   return this.httpClient.post<InjectionCondition>(`${this.apiPrefix}`, params, { headers: this.headers });
  // }

  public deleteInjectionCondition(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiPrefix}${id}`);
  }

  errorHandler(error: HttpErrorResponse) {
    // console.log(error);
    return throwError(error || 'Server Error');
  }
}
