import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WetLab } from '../models/WetLab';

@Injectable({
  providedIn: 'root'
})
export class WetLabService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: String = environment.apiPrefix;

  public getWetlabLists(): Observable<WetLab[]> {
    return this.httpClient.get<WetLab[]>(`${this.apiPrefix}api/wetlab/getAllWetlabsType`);
  }

  public getByApiKey(apiKey: string): Observable<WetLab> {
    return this.httpClient.get<WetLab>(`${this.apiPrefix}api/wetlab/${apiKey}`);
  }

}
