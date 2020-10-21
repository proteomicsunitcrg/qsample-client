import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Instrument } from '../models/Instrument';
import { InjectionCondition } from '../models/InjectionCondition';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QGeneratorService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/qgenerator/';

  headers = new HttpHeaders().set('Content-type', 'application/json');


  public getAvailableInstruments(appName: string): Observable<Instrument[]> {
    return this.httpClient.get<Instrument[]>(`${this.apiPrefix}available/${appName}`);
  }

  public getMethodsByAppNameAndInstrumentId(appName: string, selectedInstrument: Instrument): Observable<InjectionCondition> {
    return this.httpClient.get<InjectionCondition>(`${this.apiPrefix}getByAppNameAndInstrumentId/${appName}/${selectedInstrument.id}`).pipe(
      catchError(this.errorHandler)
    );
  }

  public saveInjectionCondition(condition: InjectionCondition): Observable<InjectionCondition> {
    const params = JSON.stringify(condition);
    return this.httpClient.post<InjectionCondition>(`${this.apiPrefix}`, params, { headers: this.headers });
  }

  errorHandler(error: HttpErrorResponse) {
    // console.log(error);
    return throwError(error || 'Server Error');
  }

}
