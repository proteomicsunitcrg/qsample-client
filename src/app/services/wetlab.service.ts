import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WetLabType } from '../models/WetLabType';

@Injectable({
  providedIn: 'root'
})
export class WetLabService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: String = environment.apiPrefix;

  public getWetlabLists(): Observable<WetLabType[]> {
    return this.httpClient.get<WetLabType[]>(`${this.apiPrefix}api/wetlab/getAllWetlabsType`);
  }

  public getByApiKey(apiKey: string): Observable<WetLabType> {
    console.log(apiKey);

    return this.httpClient.get<WetLabType>(`${this.apiPrefix}api/wetlab/${apiKey}`);
  }

}
