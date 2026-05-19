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
      x: dataPoints.map(point => point.label),
      y: dataPoints.map(point => point.value),
      type: 'bar'
    }];

    const layout = {
      title: chart.title,
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

  }

  renderStackedBarChart(
    chart: ChartConfig,
    dataPoints: ChartSeriesDataPoint[]
  ): void {

    const seriesNames = Array.from(
      new Set(dataPoints.map(point => point.series))
    );

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
        type: 'bar'

      };

    });

    const layout = {
      title: chart.title,
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

  }

  parseFilename(filename: string): string {

    const fileParts = filename.split('_');

    fileParts.shift();
    fileParts.shift();

    return fileParts.join('_');

  }

}