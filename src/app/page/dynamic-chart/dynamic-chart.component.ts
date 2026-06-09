import { Component, Input, OnInit } from '@angular/core';
import { PlotService } from '../../services/plot.service';

import {
  ChartService,
  ChartDataPoint,
  ChartSeriesDataPoint
} from '../../services/chart.service';

import { ChartConfig } from '../../models/chart-config.model';

declare var Plotly: any;

@Component({
  selector: 'app-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.css']
})
export class DynamicChartComponent implements OnInit {

  @Input() pageName!: string;
  @Input() requestCode!: string;
  @Input() applicationId!: number;

  charts: ChartConfig[] = [];
  chartsWithoutData: { [key: number]: boolean } = {};
  loading = false;
  error: string | null = null;
  chartDomPrefix = 'dynamicChart';

  currentOrder = 'filename';

  stackedChartKeys = [
    'secondary_reactions',
    'modification_sites',
    'modified_peptides',
    'percentage_propionyl',
    'percentage_pic',
    'missed_cleavages',
    'precursors_by_charge'
  ];

  constructor(
    private chartService: ChartService,
    private plotService: PlotService
  ) { }

  ngOnInit(): void {

    this.plotService.selectedOrder.subscribe(order => {

      this.currentOrder =
        order === 'name' ? 'filename' : (order || 'filename');

      console.log('Dynamic chart order:', order, '=>', this.currentOrder);

      this.loadCharts();

    });

  }

  loadCharts(): void {

    this.loading = true;
    this.error = null;

    const request$ = this.applicationId
      ? this.chartService.getChartsByPageAndApplication(
          this.pageName,
          this.applicationId
        )
      : this.requestCode
        ? this.chartService.getChartsByPageAndRequest(
            this.pageName,
            this.requestCode
          )
        : this.chartService.getChartsByPage(this.pageName);

    request$.subscribe({
      next: (charts) => {

        this.charts = charts;
        this.chartsWithoutData = {};
        this.loading = false;

        setTimeout(() => {
          this.charts.forEach(chart => this.renderChart(chart));
        }, 0);

      },
      error: () => {

        this.error = 'Failed to load charts';
        this.loading = false;

      }
    });

  }

  getChartDomId(chart: ChartConfig): string {
    return `${this.chartDomPrefix}_${chart.id}`;
  }

  renderChart(chart: ChartConfig): void {

    if (chart.library !== 'plotly') {
      return;
    }

    if (this.isStackedChart(chart)) {

      this.chartService.getStackedChartData(
        chart.dataSourceKey,
        this.requestCode,
        this.currentOrder
      ).subscribe({

        next: (dataPoints) => {

          if (!dataPoints || dataPoints.length === 0) {
            this.chartsWithoutData[chart.id] = true;
            return;
          }

          if (chart.chartType === 'bar') {
            this.renderStackedBarChart(chart, dataPoints);
          }

        },

        error: () => {
          this.error = `Failed to load stacked data for chart ${chart.name}`;
        }

      });

      return;

    }

    this.chartService.getChartData(
      chart.dataSourceKey,
      this.requestCode,
      this.currentOrder
    ).subscribe({

      next: (dataPoints) => {

          if (!dataPoints || dataPoints.length === 0) {
            this.chartsWithoutData[chart.id] = true;
            return;
          }

        if (chart.chartType === 'bar') {
          this.renderBarChart(chart, dataPoints);
        }

      },

      error: () => {
        this.error = `Failed to load data for chart ${chart.name}`;
      }

    });

  }

  isStackedChart(chart: ChartConfig): boolean {
    return this.stackedChartKeys.indexOf(chart.dataSourceKey) !== -1;
  }

  private isPercentChart(chart: ChartConfig): boolean {
    return chart.dataSourceKey === 'secondary_reactions';
  }

  private shouldParseFilename(chart: ChartConfig): boolean {
    return chart.dataSourceKey !== 'secondary_reactions'
      || this.isStackedChart(chart);
  }

  private formatLabel(chart: ChartConfig, label: string): string {
    if (!label) {
      return '';
    }

    return this.shouldParseFilename(chart)
      ? this.parseFilename(label)
      : label;
  }

  private getYAxisLayout(chart: ChartConfig): any {
    if (this.isPercentChart(chart)) {
      return {
        title: '% PSM',
        ticksuffix: '%',
        tickformat: '.0f'
      };
    }

    return {
      exponentformat: 'E',
      showexponent: 'all',
      tickformat: '.2e'
    };
  }

  private getHoverTemplate(
    chart: ChartConfig,
    dataPoints: ChartDataPoint[]
  ): string {
    const hasCreationDate = dataPoints.some(point => point.creationDate);
    const valueLabel = this.isPercentChart(chart)
      ? 'Value: %{text}%'
      : 'Value: %{text}';

    return hasCreationDate
      ? `${valueLabel}<br>Date: %{customdata[1]}<extra></extra>`
      : `${valueLabel}<extra></extra>`;
  }

  private hasClickableChecksum(
    dataPoints: Array<{ checksum: string }>
  ): boolean {
    return dataPoints.some(point => !!point.checksum);
  }

  private formatHoverValue(chart: ChartConfig, value: number): string {
    if (this.isPercentChart(chart)) {
      return `${value.toFixed(2)}%`;
    }

    return `${value}`;
  }

  private isProteinGroupsChart(chart: ChartConfig): boolean {
    return chart.dataSourceKey === '5008da3a-dbcd-49c3-a008-db34c4b0bb39'
      || chart.name === 'identified_protein_groups';
  }

  private getSampleGroupFromLabel(label: string): string {
    if (!label) {
      return '';
    }

    const match = label.match(/(?:^|_)(\d{3})_\d{2}(?:_|\.|$)/);

    return match ? match[1] : '';
  }

  private getProteinGroupBarColors(chart: ChartConfig, labels: string[]): string | string[] {
    const defaultColor = '#1f77b4';

    if (!this.isProteinGroupsChart(chart)) {
      return defaultColor;
    }

    const groups = labels.map(label => this.getSampleGroupFromLabel(label));
    const groupCounts = groups.reduce((counts, group) => {
      if (group) {
        counts[group] = (counts[group] || 0) + 1;
      }

      return counts;
    }, {} as { [key: string]: number });

    const replicatedGroups = Object.keys(groupCounts)
      .filter(group => groupCounts[group] > 1);

    if (replicatedGroups.length === 0) {
      return defaultColor;
    }

    const palette = [
      '#08306b',
      '#08519c',
      '#2171b5',
      '#4292c6',
      '#6baed6',
      '#9ecae1',
      '#c6dbef',
      '#deebf7'
    ];

    return groups.map(group => {
      if (!group || replicatedGroups.indexOf(group) === -1) {
        return defaultColor;
      }

      const index = replicatedGroups.indexOf(group) % palette.length;

      return palette[index];
    });
  }

  private renderPlotlyChart(
    chart: ChartConfig,
    data: any[],
    layout: any,
    config: any
  ): void {
    const plotId = this.getChartDomId(chart);

    Plotly.react(
      plotId,
      data,
      layout,
      config
    );

    setTimeout(() => {
      const plot = document.getElementById(plotId);

      if (plot && Plotly.Plots && Plotly.Plots.resize) {
        Plotly.Plots.resize(plot);
      }
    }, 0);
  }

  renderBarChart(
    chart: ChartConfig,
    dataPoints: ChartDataPoint[]
  ): void {

    const labels = dataPoints.map(point => this.formatLabel(chart, point.label));

    const data = [{
      x: labels,
      y: dataPoints.map(point => point.value),
      marker: {
        color: this.getProteinGroupBarColors(chart, labels)
      },
      customdata: dataPoints.map(point => [
        point.checksum,
        point.creationDate
      ]),
      text: dataPoints.map(point => point.value),
      hovertemplate: this.getHoverTemplate(chart, dataPoints),
      type: 'bar'
    }];

    const layout = {
      autosize: true,
      yaxis: this.getYAxisLayout(chart),
      height: chart.parameters && chart.parameters.height
        ? chart.parameters.height
        : 400
    };

    const config = {
      responsive: true
    };

    this.renderPlotlyChart(
      chart,
      data,
      layout,
      config
    );

    if (this.hasClickableChecksum(dataPoints)) {
      const plot = document.getElementById(this.getChartDomId(chart)) as any;

      if (plot) {
        plot.on('plotly_click', (eventData) => {
          this.plotService.getChecksumFromPlotlyClickEvent(eventData);
        });
      }
    }

  }

  renderStackedBarChart(
    chart: ChartConfig,
    dataPoints: ChartSeriesDataPoint[]
  ): void {

    let seriesNames = Array.from(
      new Set(dataPoints.map(point => point.series))
    );

    if (chart.dataSourceKey === 'missed_cleavages') {
      seriesNames = seriesNames
        .filter(series => series === '0' || series === '1')
        .sort((a, b) => Number(b) - Number(a));
    }

    if (chart.dataSourceKey === 'precursors_by_charge') {
      seriesNames = seriesNames
        .filter(series => series === '+2' || series === '+3' || series === '+4')
        .sort((a, b) => Number(b.replace('+', '')) - Number(a.replace('+', '')));
    }

    const labels = Array.from(
      new Set(
        dataPoints.map(point => this.formatLabel(chart, point.label))
      )
    );

    const data = seriesNames.map(seriesName => {

      return {

        x: labels,

        y: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.formatLabel(chart, point.label) === label &&
              point.series === seriesName
          );

          return match ? match.value : 0;
        }),

        name: seriesName,

        customdata: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.formatLabel(chart, point.label) === label &&
              point.series === seriesName
          );

          return match
            ? [match.checksum, match.creationDate]
            : ['', ''];
        }),

        text: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.formatLabel(chart, point.label) === label &&
              point.series === seriesName
          );

          if (!match) {
            return '';
          }

          const value = this.formatHoverValue(chart, match.value);

          return match.creationDate
            ? `Value: ${value}<br>Date: ${match.creationDate}`
            : `Value: ${value}`;
        }),

        hoverinfo: 'text',

        type: 'bar'
      };

    });

    const layout = {
      autosize: true,
      barmode: 'stack',
      yaxis: this.getYAxisLayout(chart),
      height: chart.parameters && chart.parameters.height
        ? chart.parameters.height
        : 400
    };

    const config = {
      responsive: true
    };

    this.renderPlotlyChart(
      chart,
      data,
      layout,
      config
    );

    if (this.hasClickableChecksum(dataPoints)) {
      const plot = document.getElementById(this.getChartDomId(chart)) as any;

      if (plot) {
        plot.on('plotly_click', (eventData) => {
          this.plotService.getChecksumFromPlotlyClickEvent(eventData);
        });
      }
    }

  }

  parseFilename(filename: string): string {

    if (!filename) {
      return '';
    }

    const filenameWithoutRaw = filename.replace(/\.raw$/i, '');
    const tokens = filenameWithoutRaw.split('_');

    if (tokens.length <= 2) {
      return filenameWithoutRaw;
    }

    return tokens.slice(2).join('_');

  }

}