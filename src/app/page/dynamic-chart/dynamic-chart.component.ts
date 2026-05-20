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
  loading = false;
  error: string | null = null;
  chartDomPrefix = 'dynamicChart';

  currentOrder = 'filename';

  stackedChartKeys = [
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

  renderBarChart(
    chart: ChartConfig,
    dataPoints: ChartDataPoint[]
  ): void {

    const data = [{
      x: dataPoints.map(point => this.parseFilename(point.label)),
      y: dataPoints.map(point => point.value),
      customdata: dataPoints.map(point => [
        point.checksum,
        point.creationDate
      ]),
      text: dataPoints.map(point => point.value),
      hovertemplate: 'Value: %{text}<br>Date: %{customdata[1]}<extra></extra>',
      type: 'bar'
    }];

    const layout = {
      title: chart.title,
      yaxis: {
        exponentformat: 'E',
        showexponent: 'all',
        tickformat: '.0e',
      },
      height: chart.parameters && chart.parameters.height
        ? chart.parameters.height
        : 400
    };

    const config = {
      responsive: true
    };

    Plotly.react(
      this.getChartDomId(chart),
      data,
      layout,
      config
    );

    const plot = document.getElementById(this.getChartDomId(chart)) as any;
    plot.on('plotly_click', (eventData) => {
      this.plotService.getChecksumFromPlotlyClickEvent(eventData);
    });

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
        dataPoints.map(point => this.parseFilename(point.label))
      )
    );

    const data = seriesNames.map(seriesName => {

      return {

        x: labels,

        y: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.parseFilename(point.label) === label &&
              point.series === seriesName
          );

          return match ? match.value : 0;
        }),

        name: seriesName,

        customdata: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.parseFilename(point.label) === label &&
              point.series === seriesName
          );

          return match
            ? [match.checksum, match.creationDate]
            : null;
        }),

        text: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.parseFilename(point.label) === label &&
              point.series === seriesName
          );

          return match ? match.value : 0;
        }),

        hovertemplate:
          seriesName === seriesNames[0]
            ? 'Value: %{text}<br>Date: %{customdata[1]}<extra></extra>'
            : 'Value: %{text}<extra></extra>',

        type: 'bar'

      };

    });

    const layout = {
      title: chart.title,
      yaxis: {
        exponentformat: 'E',
        showexponent: 'all',
        tickformat: '.0e',
      },
      barmode: 'stack',
      height: chart.parameters && chart.parameters.height
        ? chart.parameters.height
        : 400
    };

    const config = {
      responsive: true
    };

    Plotly.react(
      this.getChartDomId(chart),
      data,
      layout,
      config
    );

    const plot = document.getElementById(this.getChartDomId(chart)) as any;
    plot.on('plotly_click', (eventData) => {
      this.plotService.getChecksumFromPlotlyClickEvent(eventData);
    });

  }

  parseFilename(filename: string): string {

    if (!filename) {
      return filename;
    }

    const fileParts = filename.split('_');

    fileParts.shift();
    fileParts.shift();

    return fileParts
      .join('_')
      .replace(/\.raw$/i, '');

  }

}