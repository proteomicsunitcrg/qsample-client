import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WetLab } from '../models/WetLab';
import { PlotTrace } from '../models/PlotTrace';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: String = environment.apiPrefix;

  public getDataForPlot(startDate: string, endDate: string, plotApiKey: string, wetLabApiKey: string): Observable<PlotTrace[]> {
    // return this.httpClient.get<any>(`${this.apiPrefix}api/file/dummy`);
    return this.httpClient.get<PlotTrace[]>(`${this.apiPrefix}api/data/traces/${startDate}/${endDate}/${plotApiKey}/${wetLabApiKey}`);
  }

}
