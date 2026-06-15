import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ChartConfig } from '../models/chart-config.model';

export interface ChartDataPoint {
  label: string;
  value: number;
  checksum: string;
  creationDate: string;
}

export interface ChartSeriesDataPoint {
  label: string;
  series: string;
  value: number;
  checksum: string;
  creationDate: string;
}

export interface ApplicationChartConfig {
  id: number;
  applicationId: number;
  chartId: number;
  chartName: string;
  chartTitle: string;
  chartType: string;
  dataSourceKey: string;
  enabled: boolean;
  orderIndex: number;
}

export interface ApplicationChartConfigSave {
  chartId: number;
  enabled: boolean;
  orderIndex: number;
}

export interface WetlabPlotConfig {
  id: number;
  wetlabId: number;
  plotId: number;
  plotName: string;
  enabled: boolean;
  orderIndex: number;
}

export interface WetlabPlotConfigSave {
  plotId: number;
  enabled: boolean;
  orderIndex: number;
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

  getApplicationChartConfig(
    applicationId: number
  ): Observable<ApplicationChartConfig[]> {
    return this.http.get<ApplicationChartConfig[]>(
      `${this.apiUrl}/application-config/${applicationId}`
    );
  }

  initializeApplicationChartConfig(
    applicationId: number
  ): Observable<ApplicationChartConfig[]> {
    return this.http.post<ApplicationChartConfig[]>(
      `${this.apiUrl}/application-config/${applicationId}/initialize`,
      {}
    );
  }

  saveApplicationChartConfig(
    applicationId: number,
    configs: ApplicationChartConfigSave[]
  ): Observable<ApplicationChartConfig[]> {
    return this.http.post<ApplicationChartConfig[]>(
      `${this.apiUrl}/application-config/${applicationId}`,
      configs
    );
  }

  getWetlabPlotConfig(
    wetlabId: number
  ): Observable<WetlabPlotConfig[]> {
    return this.http.get<WetlabPlotConfig[]>(
      `${this.apiUrl}/wetlab-config/${wetlabId}`
    );
  }

  initializeWetlabPlotConfig(
    wetlabId: number
  ): Observable<WetlabPlotConfig[]> {
    return this.http.post<WetlabPlotConfig[]>(
      `${this.apiUrl}/wetlab-config/${wetlabId}/initialize`,
      {}
    );
  }

  saveWetlabPlotConfig(
    wetlabId: number,
    configs: WetlabPlotConfigSave[]
  ): Observable<WetlabPlotConfig[]> {
    return this.http.post<WetlabPlotConfig[]>(
      `${this.apiUrl}/wetlab-config/${wetlabId}`,
      configs
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
