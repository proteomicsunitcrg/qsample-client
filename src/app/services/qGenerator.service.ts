import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Instrument } from '../models/Instrument';
import { InjectionCondition } from '../models/InjectionCondition';

@Injectable({
  providedIn: 'root'
})
export class qGeneratorService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: String = environment.apiPrefix + 'api/qgenerator/';


  public getAvailableInstruments(appName: string): Observable <Instrument[]> {
    return this.httpClient.get<Instrument[]>(`${this.apiPrefix}available/${appName}`);
  }

  public getMethodsByAppNameAndInstrumentId(appName: string, selectedInstrument: Instrument): Observable <InjectionCondition> {
    return this.httpClient.get<InjectionCondition>(`${this.apiPrefix}getByAppNameAndInstrumentId/${appName}/${selectedInstrument.id}`);
  }

}
