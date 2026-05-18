import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ChartConfig } from '../models/chart-config.model';

export interface ChartDataPoint {
  label: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private apiUrl = '/api/charts';

  constructor(private http: HttpClient) { }

  getChartsByPage(pageName: string): Observable<ChartConfig[]> {
    return this.http.get<ChartConfig[]>(
      `${this.apiUrl}/page/${pageName}`
    );
  }

  getChartData(dataSourceKey: string, requestCode: string): Observable<ChartDataPoint[]> {
    return this.http.get<ChartDataPoint[]>(
      `${this.apiUrl}/data/${dataSourceKey}/request/${requestCode}`
    );
  }
}