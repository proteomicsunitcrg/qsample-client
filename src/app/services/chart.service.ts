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

export interface ChartDefinition {
  id: number;
  name: string;
  title: string;
  description: string;
  chartType: string;
  chartMode: string;
  library: string;
  dataSourceKey: string;
  active: boolean;
}

export interface ChartParameter {
  key: string;
  value: string;
  type: string;
  description?: string;
}

export interface ChartDefinitionDetail extends ChartDefinition {
  parameters: ChartParameter[];
}

export interface ChartParameterSave {
  key: string;
  value: string;
  type: string;
  description?: string;
}

export interface ChartDefinitionSave {
  name: string;
  title: string;
  description: string;
  chartType: string;
  chartMode: string;
  library: string;
  dataSourceKey: string;
  active: boolean;
  parameters: ChartParameterSave[];
}

export interface ChartDataSourceContext {
  id: number;
  name: string;
  abbreviated: string;
}

export interface ChartDataSource {
  id: number;
  name: string;
  apiKey: string;
  paramId: number;
  paramName: string;
  contextSources: ChartDataSourceContext[];
}

export interface ChartDataSourceOption {
  id: number;
  name: string;
}

export interface ChartDataSourceOptions {
  params: ChartDataSourceOption[];
  contextSources: ChartDataSourceContext[];
}

export interface ChartDataSourceSave {
  name: string;
  paramId: number;
  contextSourceIds: number[];
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

  createChart(chart: ChartDefinitionSave): Observable<ChartDefinition> {
    return this.http.post<ChartDefinition>(
      this.apiUrl,
      chart
    );
  }

  getChart(chartId: number): Observable<ChartDefinitionDetail> {
    return this.http.get<ChartDefinitionDetail>(
      `${this.apiUrl}/${chartId}`
    );
  }

  updateChart(
    chartId: number,
    chart: ChartDefinitionSave
  ): Observable<ChartDefinitionDetail> {
    return this.http.put<ChartDefinitionDetail>(
      `${this.apiUrl}/${chartId}`,
      chart
    );
  }

  deleteChart(chartId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${chartId}`
    );
  }

  getChartDataSources(): Observable<ChartDataSource[]> {
    return this.http.get<ChartDataSource[]>(
      `${this.apiUrl}/data-sources`
    );
  }

  getChartDataSource(dataSourceId: number): Observable<ChartDataSource> {
    return this.http.get<ChartDataSource>(
      `${this.apiUrl}/data-sources/${dataSourceId}`
    );
  }

  getChartDataSourceOptions(): Observable<ChartDataSourceOptions> {
    return this.http.get<ChartDataSourceOptions>(
      `${this.apiUrl}/data-source-options`
    );
  }

  createChartDataSource(
    dataSource: ChartDataSourceSave
  ): Observable<ChartDataSource> {
    return this.http.post<ChartDataSource>(
      `${this.apiUrl}/data-sources`,
      dataSource
    );
  }

  updateChartDataSource(
    dataSourceId: number,
    dataSource: ChartDataSourceSave
  ): Observable<ChartDataSource> {
    return this.http.put<ChartDataSource>(
      `${this.apiUrl}/data-sources/${dataSourceId}`,
      dataSource
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
    chartId: number,
    requestCode: string,
    order: string
  ): Observable<ChartDataPoint[]> {
    return this.http.get<ChartDataPoint[]>(
      `${this.apiUrl}/data/chart/${chartId}/request/${requestCode}?order=${order}`
    );
  }

  getStackedChartData(
    chartId: number,
    requestCode: string,
    order: string
  ): Observable<ChartSeriesDataPoint[]> {
    return this.http.get<ChartSeriesDataPoint[]>(
      `${this.apiUrl}/stacked-data/chart/${chartId}/request/${requestCode}?order=${order}`
    );
  }
}
