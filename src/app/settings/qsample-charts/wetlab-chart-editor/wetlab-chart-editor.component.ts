import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';

import { WetLab } from '../../../models/WetLab';
import { ChartConfig } from '../../../models/chart-config.model';
import { WetLabService } from '../../../services/wetlab.service';
import {
  ChartDataSource,
  ChartDataSourceOptions,
  ChartDataSourceSave,
  ChartDefinitionDetail,
  ChartDefinitionSave,
  ChartParameterSave,
  ChartService,
  WetlabChartConfig,
  WetlabChartConfigSave
} from '../../../services/chart.service';

@Component({
  selector: 'app-wetlab-chart-editor',
  templateUrl: './wetlab-chart-editor.component.html',
  styleUrls: ['./wetlab-chart-editor.component.css']
})
export class WetlabChartEditorComponent implements OnInit {

  private readonly pageName = 'request_details';

  wetlabId: number;
  wetlab: WetLab;

  chartConfigs: WetlabChartConfig[] = [];
  pageCharts: ChartConfig[] = [];
  dataSources: ChartDataSource[] = [];
  dataSourcesLoaded = false;

  dataSourceOptions: ChartDataSourceOptions = {
    params: [],
    contextSources: []
  };

  editingPlotId: number;
  editingChartId: number | null = null;
  isCreatingDataSource = false;

  dataSourceForm: ChartDataSourceSave = this.createEmptyDataSource();
  newChart: ChartDefinitionSave = this.createEmptyChart();

  chartColumnsToDisplay = ['enabled', 'orderIndex', 'chartTitle', 'actions'];
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
    private wetLabService: WetLabService,
    private chartService: ChartService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(
      params => {
        this.wetlabId = Number(params.id);
        this.loadWetlab();
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

  private loadWetlab(): void {
    this.wetLabService.getWetlabLists().subscribe(
      res => {
        this.wetlab = res.find(wetlab => wetlab.id === this.wetlabId);
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading WetLab', 'Close');
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
    this.chartService.getWetlabChartConfig(this.wetlabId).subscribe(
      res => {
        this.chartConfigs = this.filterChartConfigsForPage(res);
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading WetLab chart configuration', 'Close');
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
              wetlabId: this.wetlabId,
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

    if (duplicateDataSource && duplicateDataSource.id !== this.editingPlotId) {
      this.openSnackBar('Data source already exists, select it in the chart form', 'Close');
      return;
    }

    if (!this.canSaveDataSource()) {
      this.openSnackBar('Name, param and at least one context source are required', 'Close');
      return;
    }

    this.isCreatingDataSource = true;

    const dataSource: ChartDataSourceSave = {
      name: this.dataSourceForm.name.trim(),
      paramId: this.dataSourceForm.paramId,
      contextSourceIds: this.getNormalizedContextSourceIds(this.dataSourceForm.contextSourceIds)
    };

    const action$ = this.editingPlotId
      ? this.chartService.updateChartDataSource(this.editingPlotId, dataSource).pipe(map(() => undefined))
      : this.chartService.createWetlabDataSource(this.wetlabId, dataSource).pipe(map(() => undefined));

    action$.subscribe(
      () => {
        const wasEditing = !!this.editingPlotId;
        this.cancelDataSourceEdit();
        this.loadDataSources();
        this.openSnackBar(
          wasEditing ? 'WetLab data source updated' : 'WetLab data source created',
          'Close'
        );
        this.isCreatingDataSource = false;
      },
      err => {
        console.error(err);
        this.openSnackBar(
          this.editingPlotId ? 'Error updating WetLab data source' : 'Error creating WetLab data source',
          'Close'
        );
        this.isCreatingDataSource = false;
      }
    );
  }

  public cancelDataSourceEdit(): void {
    this.editingPlotId = undefined;
    this.dataSourceForm = this.createEmptyDataSource();
  }

  public editDataSource(dataSource: ChartDataSource): void {
    this.editingPlotId = dataSource.id;
    this.dataSourceForm = {
      name: dataSource.name,
      paramId: dataSource.paramId,
      contextSourceIds: this.getNormalizedContextSourceIds(dataSource.contextSources.map(contextSource => contextSource.id))
    };
  }

  public deleteDataSource(dataSource: ChartDataSource): void {
    if (!confirm(`Delete data source "${dataSource.name}"?`)) {
      return;
    }

    this.chartService.deleteChartDataSource(dataSource.id).subscribe(
      () => {
        this.cancelDataSourceEdit();
        this.loadDataSources();
        this.openSnackBar('Data source deleted', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error deleting data source', 'Close');
      }
    );
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

  public deleteChart(chart: WetlabChartConfig): void {
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
    const configsToSave: WetlabChartConfigSave[] =
      this.chartConfigs.map(config => ({
        chartId: config.chartId,
        enabled: config.enabled,
        orderIndex: config.orderIndex
      }));

    this.chartService.saveWetlabChartConfig(
      this.wetlabId,
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

    return this.hasValue(this.dataSourceForm.name)
      && !!this.dataSourceForm.paramId
      && this.dataSourceForm.contextSourceIds.length > 0
      && (!duplicateDataSource || duplicateDataSource.id === this.editingPlotId)
      && !this.isCreatingDataSource;
  }

  public hasBlockingDataSourceDuplicate(): boolean {
    const duplicateDataSource = this.getDuplicateDataSource();

    return !!duplicateDataSource
      && (!this.editingPlotId || duplicateDataSource.id !== this.editingPlotId);
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

  private filterChartConfigsForPage(
    configs: WetlabChartConfig[]
  ): WetlabChartConfig[] {
    if (!this.pageCharts.length) {
      return configs;
    }

    const pageChartIds = new Set(this.pageCharts.map(chart => chart.id));

    return configs.filter(config => pageChartIds.has(config.chartId));
  }

  private ensurePageChartIncluded(chart: {
    id: number;
    name: string;
    title: string;
    description?: string;
    chartType: string;
    library: string;
    dataSourceKey: string;
    active: boolean;
  }): void {
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

  private recalculateChartOrder(): void {
    this.chartConfigs = this.chartConfigs.map((config, index) => ({
      ...config,
      orderIndex: index + 1
    }));
  }

  private persistChartOrder(successMessage: string): void {
    const configsToSave: WetlabChartConfigSave[] =
      this.chartConfigs.map(config => ({
        chartId: config.chartId,
        enabled: config.enabled,
        orderIndex: config.orderIndex
      }));

    this.chartService.saveWetlabChartConfig(
      this.wetlabId,
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
    const normalizedName = this.normalizeValue(this.dataSourceForm.name);
    const normalizedContextSourceIds = this.getNormalizedContextSourceIds(this.dataSourceForm.contextSourceIds);

    if (!normalizedName || !this.dataSourceForm.paramId || normalizedContextSourceIds.length === 0) {
      return null;
    }

    return this.dataSources.find(dataSource => {
      const currentName = this.normalizeValue(dataSource.name);
      const currentContextSourceIds = this.getNormalizedContextSourceIds(
        (dataSource.contextSources || []).map(contextSource => contextSource.id)
      );

      return currentName === normalizedName
        && dataSource.paramId === this.dataSourceForm.paramId
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

  private resetChartForm(): void {
    this.editingChartId = null;
    this.newChart = this.createEmptyChart();
    this.newChartYAxisFormat = 'auto';
    this.newChartYAxisUnit = '';
  }

}
