import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WetLab } from '../models/WetLab';
import { File } from '../models/File';
import { Guideset } from '../models/Guideset';

@Injectable({
  providedIn: 'root'
})
export class GuidesetService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/guideset/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  public setGuideset(wetlab: WetLab, files: File[]): Observable<Guideset> {
    const params = JSON.stringify(files);
    return this.httpClient.post<Guideset>(`${this.apiPrefix}set/${wetlab.apiKey}`, params, this.httpOptions);
  }

  public getGuidesetByWetlabApiKey(wetLab: WetLab): Observable<Guideset> {
    return this.httpClient.get<any>(`${this.apiPrefix}getByWetLabApiKey/${wetLab.apiKey}`);
  }

  public deleteGuideset(guideset: Guideset): Observable<boolean> {
    const params = JSON.stringify(guideset);
    return this.httpClient.post<boolean>(`${this.apiPrefix}delete`, params, this.httpOptions);
  }

}
