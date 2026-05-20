import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ChartConfig } from '../models/chart-config.model';

export interface ChartDataPoint {
  label: string;
  value: number;
  checksum: string;
}

export interface ChartSeriesDataPoint {
  label: string;
  series: string;
  value: number;
  checksum: string;
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

  getChartsByPageAndRequest(
    pageName: string,
    requestCode: string
  ): Observable<ChartConfig[]> {
    return this.http.get<ChartConfig[]>(
      `${this.apiUrl}/page/${pageName}/request/${requestCode}`
    );
  }

  getChartsByPageAndApplication(
    pageName: string,
    applicationId: number
  ): Observable<ChartConfig[]> {
    return this.http.get<ChartConfig[]>(
      `${this.apiUrl}/page/${pageName}/application/${applicationId}`
    );
  }

  getChartData(
    dataSourceKey: string,
    requestCode: string,
    order: string
  ): Observable<ChartDataPoint[]> {
    return this.http.get<ChartDataPoint[]>(
      `${this.apiUrl}/data/${dataSourceKey}/request/${requestCode}?order=${order}`
    );
  }

  getStackedChartData(
    dataSourceKey: string,
    requestCode: string,
    order: string
  ): Observable<ChartSeriesDataPoint[]> {
    return this.http.get<ChartSeriesDataPoint[]>(
      `${this.apiUrl}/stacked-data/${dataSourceKey}/request/${requestCode}?order=${order}`
    );
  }
}