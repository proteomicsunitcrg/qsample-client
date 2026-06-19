import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Application } from '../../../models/Application';
import { ChartConfig } from '../../../models/chart-config.model';
import { ApplicationService } from '../../../services/application.service';
import {
  ApplicationChartConfig,
  ApplicationChartConfigSave,
  ChartDataSource,
  ChartDataSourceOptions,
  ChartDataSourceSave,
  ChartDefinitionDetail,
  ChartDefinitionSave,
  ChartParameterSave,
  ChartService
} from '../../../services/chart.service';

@Component({
  selector: 'app-application-chart-editor',
  templateUrl: './application-chart-editor.component.html',
  styleUrls: ['./application-chart-editor.component.css']
})
export class ApplicationChartEditorComponent implements OnInit {

  private readonly pageName = 'request_details';

  applicationId: number;
  application: Application;
  chartConfigs: ApplicationChartConfig[] = [];
  pageCharts: ChartConfig[] = [];
  dataSources: ChartDataSource[] = [];
  dataSourcesLoaded = false;
  dataSourceOptions: ChartDataSourceOptions = {
    params: [],
    contextSources: []
  };
  newDataSource: ChartDataSourceSave = this.createEmptyDataSource();
  newChart: ChartDefinitionSave = this.createEmptyChart();
  editingDataSourceId: number | null = null;
  editingChartId: number | null = null;
  isCreatingDataSource = false;

  columnsToDisplay = ['enabled', 'orderIndex', 'chartTitle', 'actions'];
  dataSourceColumnsToDisplay = ['name', 'param', 'contextSources', 'actions'];
  parameterTypes = ['string', 'number', 'boolean'];
  chartTypes = ['bar'];
  chartModes = [
    { value: 'SIMPLE_BAR', label: 'Simple bar' },
    { value: 'STACKED_BAR', label: 'Stacked bar' }
  ];
  yAxisFormats = [
    { value: 'auto', label: 'Auto' },
    { value: 'normal', label: 'Normal number' },
    { value: 'scientific', label: 'Scientific notation' }
  ];
  newChartYAxisFormat = 'auto';
  newChartYAxisUnit = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private applicationService: ApplicationService,
    private chartService: ChartService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(
      params => {
        this.applicationId = Number(params.id);
        this.loadApplication();
        this.loadPageCharts();
        this.loadChartConfigs();
        this.loadDataSources();
        this.loadDataSourceOptions();
      },
      err => {
        console.error(err);
      }
    );
  }

  private loadDataSources(): void {
    this.chartService.getChartDataSources().subscribe(
      res => {
        this.dataSources = this.sortDataSources(res);
        this.dataSourcesLoaded = true;
      },
      err => {
        console.error(err);
        this.dataSourcesLoaded = true;
        this.openSnackBar('Error loading data sources', 'Close');
      }
    );
  }

  private loadDataSourceOptions(): void {
    this.chartService.getChartDataSourceOptions().subscribe(
      res => {
        this.dataSourceOptions = {
          params: [...res.params].sort((left, right) =>
            left.name.localeCompare(right.name)
          ),
          contextSources: [...res.contextSources].sort((left, right) =>
            this.getContextSourceLabel(left).localeCompare(this.getContextSourceLabel(right))
          )
        };
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading data source options', 'Close');
      }
    );
  }

  private loadApplication(): void {
    this.applicationService.getById(this.applicationId).subscribe(
      res => {
        this.application = res;
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading application', 'Close');
      }
    );
  }

  private loadPageCharts(): void {
    this.chartService.getChartsByPage(this.pageName).subscribe(
      res => {
        this.pageCharts = res;
        this.chartConfigs = this.filterChartConfigsForPage(this.chartConfigs);
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading page charts', 'Close');
      }
    );
  }

  private loadChartConfigs(): void {
    this.chartService.getApplicationChartConfig(this.applicationId).subscribe(
      res => {
        this.chartConfigs = this.filterChartConfigsForPage(res);
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading chart configuration', 'Close');
      }
    );
  }

  public initializeCharts(): void {
    this.chartService.initializeApplicationChartConfig(this.applicationId).subscribe(
      res => {
        this.chartConfigs = this.filterChartConfigsForPage(res);
        this.openSnackBar('Chart configuration initialized', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error initializing chart configuration', 'Close');
      }
    );
  }

  public createChart(): void {
    const action$ = this.editingChartId
      ? this.chartService.updateChart(this.editingChartId, this.buildChartPayload())
      : this.chartService.createChart(this.buildChartPayload());

    action$.subscribe(
      chart => {
        if (this.editingChartId) {
          this.chartConfigs = this.chartConfigs.map(config =>
            config.chartId === chart.id
              ? {
                  ...config,
                  chartName: chart.name,
                  chartTitle: chart.title,
                  chartType: chart.chartType,
                  dataSourceKey: chart.dataSourceKey,
                  enabled: chart.active
                }
              : config
          );
          this.openSnackBar('Chart updated. Saving configuration...', 'Close');
        } else {
          this.ensurePageChartIncluded(chart);
          this.chartConfigs = [
            ...this.chartConfigs,
            {
              id: 0,
              applicationId: this.applicationId,
              chartId: chart.id,
              chartName: chart.name,
              chartTitle: chart.title,
              chartType: chart.chartType,
              dataSourceKey: chart.dataSourceKey,
              enabled: chart.active,
              orderIndex: this.chartConfigs.length + 1
            }
          ];
          this.openSnackBar('Chart created. Saving configuration...', 'Close');
        }

        this.saveCharts();
        this.resetChartForm();
      },
      err => {
        console.error(err);
        this.openSnackBar(
          this.editingChartId ? 'Error updating chart' : 'Error creating chart',
          'Close'
        );
      }
    );
  }

  public saveDataSource(): void {
    const duplicateDataSource = this.getDuplicateDataSource();

    if (duplicateDataSource && duplicateDataSource.id !== this.editingDataSourceId) {
      this.openSnackBar('Data source already exists, reusing it', 'Close');
      this.newChart.dataSourceKey = duplicateDataSource.apiKey;
      return;
    }

    this.isCreatingDataSource = true;

    const payload: ChartDataSourceSave = {
      name: this.newDataSource.name.trim(),
      paramId: this.newDataSource.paramId,
      contextSourceIds: this.getNormalizedContextSourceIds(this.newDataSource.contextSourceIds)
    };

    const action$ = this.editingDataSourceId
      ? this.chartService.updateChartDataSource(this.editingDataSourceId, payload)
      : this.chartService.createChartDataSource(payload);

    action$.subscribe(
      dataSource => {
        this.upsertDataSource(dataSource);
        this.newChart.dataSourceKey = dataSource.apiKey;
        const wasEditing = !!this.editingDataSourceId;
        this.resetDataSourceForm();
        this.openSnackBar(
          wasEditing ? 'Data source updated' : 'Data source ready',
          'Close'
        );
        this.isCreatingDataSource = false;
      },
      err => {
        console.error(err);
        this.openSnackBar(
          this.editingDataSourceId ? 'Error updating data source' : 'Error creating data source',
          'Close'
        );
        this.isCreatingDataSource = false;
      }
    );
  }

  public deleteDataSource(dataSource: ChartDataSource): void {
    if (!window.confirm(`Delete data source "${dataSource.name}"?`)) {
      return;
    }

    this.chartService.deleteChartDataSource(dataSource.id).subscribe(
      () => {
        if (this.editingDataSourceId === dataSource.id) {
          this.cancelDataSourceEdit();
        }

        this.loadDataSources();
      },
      error => {
        const message = error && error.error && error.error.message
          ? error.error.message
          : 'Error deleting data source';

        window.alert(message);
      }
    );
  }

  public editDataSource(dataSource: ChartDataSource): void {
    this.editingDataSourceId = dataSource.id;
    this.newDataSource = {
      name: dataSource.name,
      paramId: dataSource.paramId,
      contextSourceIds: this.getNormalizedContextSourceIds(
        (dataSource.contextSources || []).map(contextSource => contextSource.id)
      )
    };
  }

  public cancelDataSourceEdit(): void {
    this.resetDataSourceForm();
  }

  public editChart(chartId: number): void {
    this.chartService.getChart(chartId).subscribe(
      chart => {
        this.editingChartId = chart.id;
        this.newChart = this.toChartForm(chart);
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading chart', 'Close');
      }
    );
  }

  public deleteChart(chart: ApplicationChartConfig): void {
    if (!window.confirm(`Delete chart ${chart.chartTitle}?`)) {
      return;
    }

    this.chartService.deleteChart(chart.chartId).subscribe(
      () => {
        this.chartConfigs = this.chartConfigs.filter(
          config => config.chartId !== chart.chartId
        );
        this.recalculateChartOrder();
        this.persistChartOrder('Chart deleted');
        if (this.editingChartId === chart.chartId) {
          this.resetChartForm();
        }
      },
      err => {
        console.error(err);
        this.openSnackBar('Error deleting chart', 'Close');
      }
    );
  }

  public cancelEdit(): void {
    this.resetChartForm();
  }

  public saveCharts(): void {
    const configsToSave: ApplicationChartConfigSave[] =
      this.chartConfigs.map(config => ({
        chartId: config.chartId,
        enabled: config.enabled,
        orderIndex: config.orderIndex
      }));

    this.chartService.saveApplicationChartConfig(
      this.applicationId,
      configsToSave
    ).subscribe(
      res => {
          this.loadPageCharts();
        this.chartConfigs = this.filterChartConfigsForPage(res);
        this.openSnackBar('Chart configuration saved', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error saving chart configuration', 'Close');
      }
    );
  }

  private filterChartConfigsForPage(
    configs: ApplicationChartConfig[]
  ): ApplicationChartConfig[] {
    if (!this.pageCharts.length) {
      return configs;
    }

    const pageChartIds = new Set(this.pageCharts.map(chart => chart.id));

    return configs.filter(config => pageChartIds.has(config.chartId));
  }

  private ensurePageChartIncluded(chart: { id: number; name: string; title: string; description?: string; chartType: string; library: string; dataSourceKey: string; active: boolean }): void {
    if (this.pageCharts.some(pageChart => pageChart.id === chart.id)) {
      return;
    }

    this.pageCharts = [
      ...this.pageCharts,
      {
        id: chart.id,
        name: chart.name,
        title: chart.title,
        description: chart.description || '',
        chartType: chart.chartType,
        library: chart.library,
        dataSourceKey: chart.dataSourceKey,
        chartMode: 'SIMPLE_BAR',
        active: chart.active,
        parameters: {}
      }
    ];
  }
  public moveChartUp(index: number): void {
    if (index <= 0) {
      return;
    }

    const previous = this.chartConfigs[index - 1];
    this.chartConfigs[index - 1] = this.chartConfigs[index];
    this.chartConfigs[index] = previous;

    this.recalculateChartOrder();
  }

  public moveChartDown(index: number): void {
    if (index >= this.chartConfigs.length - 1) {
      return;
    }

    const next = this.chartConfigs[index + 1];
    this.chartConfigs[index + 1] = this.chartConfigs[index];
    this.chartConfigs[index] = next;

    this.recalculateChartOrder();
  }

  public addParameter(): void {
    this.newChart.parameters = [
      ...this.newChart.parameters,
      this.createEmptyParameter()
    ];
  }

  public removeParameter(index: number): void {
    this.newChart.parameters = this.newChart.parameters.filter(
      (_, currentIndex) => currentIndex !== index
    );
  }

  public canCreateChart(): boolean {
    this.updateGeneratedChartName();

    return this.hasValue(this.newChart.name)
      && this.hasValue(this.newChart.title)
      && this.hasValue(this.newChart.chartType)
      && this.hasValue(this.newChart.dataSourceKey)
      && this.hasValue(this.newChart.library)
      && !this.hasDuplicateGeneratedChartName();
  }

  public canSaveDataSource(): boolean {
    const duplicateDataSource = this.getDuplicateDataSource();

    return this.hasValue(this.newDataSource.name)
      && !!this.newDataSource.paramId
      && this.newDataSource.contextSourceIds.length > 0
      && (!duplicateDataSource || duplicateDataSource.id === this.editingDataSourceId)
      && !this.isCreatingDataSource;
  }

  public isDataSourceDuplicate(): boolean {
    return !!this.getDuplicateDataSource();
  }

  public hasBlockingDataSourceDuplicate(): boolean {
    const duplicateDataSource = this.getDuplicateDataSource();

    return !!duplicateDataSource
      && (!this.editingDataSourceId || duplicateDataSource.id !== this.editingDataSourceId);
  }

  public getContextSourceLabel(contextSource: { name: string; abbreviated: string }): string {
    if (!contextSource.abbreviated || contextSource.abbreviated === contextSource.name) {
      return contextSource.name;
    }

    return `${contextSource.name} (${contextSource.abbreviated})`;
  }

  public hasLegacyDataSourceSelection(): boolean {
    return this.dataSourcesLoaded
      && this.hasValue(this.newChart.dataSourceKey)
      && !this.dataSources.some(dataSource => dataSource.apiKey === this.newChart.dataSourceKey);
  }

  public getLegacyDataSourceLabel(): string {
    return `Legacy/special: ${this.newChart.dataSourceKey}`;
  }

  public getDataSourceLabel(dataSource: ChartDataSource): string {
    const contextLabels = this.getDataSourceContextLabel(dataSource);

    return contextLabels
      ? `${dataSource.name} - ${dataSource.paramName} - ${contextLabels}`
      : `${dataSource.name} - ${dataSource.paramName}`;
  }

  public getDataSourceContextLabel(dataSource: ChartDataSource): string {
    return (dataSource.contextSources || [])
      .map(contextSource => contextSource.name)
      .join(', ');
  }

  private upsertDataSource(dataSource: ChartDataSource): void {
    const existingIndex = this.dataSources.findIndex(
      current => current.id === dataSource.id
    );

    if (existingIndex >= 0) {
      this.dataSources = this.dataSources.map(current =>
        current.id === dataSource.id ? dataSource : current
      );
    } else {
      this.dataSources = [
        ...this.dataSources,
        dataSource
      ];
    }

    this.dataSources = this.sortDataSources(this.dataSources);
  }

  private recalculateChartOrder(): void {
    this.chartConfigs = this.chartConfigs.map((config, index) => ({
      ...config,
      orderIndex: index + 1
    }));
  }

  private persistChartOrder(successMessage: string): void {
    const configsToSave: ApplicationChartConfigSave[] =
      this.chartConfigs.map(config => ({
        chartId: config.chartId,
        enabled: config.enabled,
        orderIndex: config.orderIndex
      }));

    this.chartService.saveApplicationChartConfig(
      this.applicationId,
      configsToSave
    ).subscribe(
      res => {
        this.loadPageCharts();
        this.chartConfigs = this.filterChartConfigsForPage(res);
        this.openSnackBar(successMessage, 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error saving chart configuration', 'Close');
        this.loadChartConfigs();
      }
    );
  }

  public goBack(): void {
    this.router.navigate(['/settings/qsample/charts']);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  private createEmptyChart(): ChartDefinitionSave {
    return {
      name: '',
      title: '',
      description: '',
      chartType: 'bar',
      chartMode: 'SIMPLE_BAR',
      library: 'plotly',
      dataSourceKey: '',
      active: true,
      parameters: []
    };
  }

  private createEmptyDataSource(): ChartDataSourceSave {
    return {
      name: '',
      paramId: null,
      contextSourceIds: []
    };
  }

  private createEmptyParameter(): ChartParameterSave {
    return {
      key: '',
      value: '',
      type: 'string',
      description: ''
    };
  }

  public updateGeneratedChartName(): void {
    this.newChart.name = this.generateChartNameFromTitle(this.newChart.title);
  }

  public hasDuplicateGeneratedChartName(): boolean {
    const generatedName = this.normalizeValue(this.newChart.name);

    if (!generatedName) {
      return false;
    }

    return this.chartConfigs.some(
      chart => this.normalizeValue(chart.chartName) === generatedName
        && chart.chartId !== this.editingChartId
    );
  }

  private generateChartNameFromTitle(title?: string | null): string {
    return (title || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
  }

  private hasValue(value: string): boolean {
    return !!value && value.trim().length > 0;
  }

  private buildChartPayload(): ChartDefinitionSave {
    const generatedName = this.generateChartNameFromTitle(this.newChart.title);

    return {
      ...this.newChart,
      name: generatedName,
      title: this.newChart.title.trim(),
      description: this.newChart.description.trim(),
      chartType: this.newChart.chartType.trim(),
      chartMode: this.normalizeChartMode(this.newChart.chartMode),
      library: this.newChart.library.trim(),
      dataSourceKey: this.newChart.dataSourceKey.trim(),
      parameters: this.buildChartParameters()
    };
  }

  private buildChartParameters(): ChartParameterSave[] {
    const parameters = this.newChart.parameters
      .filter(parameter => parameter.key.trim().length > 0)
      .filter(parameter => !['yAxisFormat', 'yAxisUnit'].includes(parameter.key.trim()))
      .map(parameter => ({
        ...parameter,
        key: parameter.key.trim(),
        value: parameter.value.trim(),
        type: parameter.type.trim(),
        description: parameter.description ? parameter.description.trim() : ''
      }));

    if (this.newChartYAxisFormat && this.newChartYAxisFormat !== 'auto') {
      parameters.push({
        key: 'yAxisFormat',
        value: this.newChartYAxisFormat,
        type: 'string',
        description: 'Y axis value format'
      });
    }

    if (this.hasValue(this.newChartYAxisUnit)) {
      parameters.push({
        key: 'yAxisUnit',
        value: this.newChartYAxisUnit.trim(),
        type: 'string',
        description: 'Y axis unit suffix'
      });
    }

    return parameters;
  }

  private getDuplicateDataSource(): ChartDataSource | null {
    const normalizedName = this.normalizeValue(this.newDataSource.name);
    const normalizedContextSourceIds = this.getNormalizedContextSourceIds(this.newDataSource.contextSourceIds);

    if (!normalizedName || !this.newDataSource.paramId || normalizedContextSourceIds.length === 0) {
      return null;
    }

    return this.dataSources.find(dataSource => {
      const currentName = this.normalizeValue(dataSource.name);
      const currentContextSourceIds = this.getNormalizedContextSourceIds(
        (dataSource.contextSources || []).map(contextSource => contextSource.id)
      );

      return currentName === normalizedName
        && dataSource.paramId === this.newDataSource.paramId
        && this.sameNumberArray(currentContextSourceIds, normalizedContextSourceIds);
    }) || null;
  }

  private getNormalizedContextSourceIds(contextSourceIds: number[]): number[] {
    return Array.from(new Set(contextSourceIds || [])).sort((left, right) => left - right);
  }

  private normalizeValue(value: string): string {
    return value ? value.trim().toLowerCase() : '';
  }

  private normalizeChartMode(chartMode: string): string {
    return chartMode === 'STACKED_BAR' ? 'STACKED_BAR' : 'SIMPLE_BAR';
  }

  private sameNumberArray(left: number[], right: number[]): boolean {
    if (left.length !== right.length) {
      return false;
    }

    return left.every((value, index) => value === right[index]);
  }

  private sortDataSources(dataSources: ChartDataSource[]): ChartDataSource[] {
    return [...dataSources].sort((left, right) =>
      this.getDataSourceLabel(left).localeCompare(this.getDataSourceLabel(right))
    );
  }

  private toChartForm(chart: ChartDefinitionDetail): ChartDefinitionSave {
    this.newChartYAxisFormat = this.normalizeYAxisFormat(this.getChartParameterValue(chart, 'yAxisFormat'));
    this.newChartYAxisUnit = this.getChartParameterValue(chart, 'yAxisUnit');

    return {
      name: chart.name,
      title: chart.title,
      description: chart.description || '',
      chartType: chart.chartType,
      chartMode: this.normalizeChartMode(chart.chartMode),
      library: chart.library,
      dataSourceKey: chart.dataSourceKey,
      active: chart.active,
      parameters: (chart.parameters || [])
        .filter(parameter => !['yAxisFormat', 'yAxisUnit'].includes(parameter.key))
        .map(parameter => ({
          key: parameter.key,
          value: parameter.value || '',
          type: parameter.type || 'string',
          description: parameter.description || ''
        }))
    };
  }

  private getChartParameterValue(chart: ChartDefinitionDetail, key: string): string {
    const parameter = (chart.parameters || []).find(item => item.key === key);

    return parameter && parameter.value ? parameter.value.trim() : '';
  }

  private normalizeYAxisFormat(value: string): string {
    return ['normal', 'scientific'].includes(value)
      ? value
      : 'auto';
  }

  private resetDataSourceForm(): void {
    this.editingDataSourceId = null;
    this.newDataSource = this.createEmptyDataSource();
  }

  private resetChartForm(): void {
    this.editingChartId = null;
    this.newChart = this.createEmptyChart();
    this.newChartYAxisFormat = 'auto';
    this.newChartYAxisUnit = '';
  }

}
