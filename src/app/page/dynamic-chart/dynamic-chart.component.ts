import { Component, Input, OnInit } from '@angular/core';

import { ChartService } from '../../services/chart.service';
import { ChartConfig } from '../../models/chart-config.model';

declare var Plotly: any;

@Component({
  selector: 'app-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.css']
})
export class DynamicChartComponent implements OnInit {

  @Input() pageName!: string;

  charts: ChartConfig[] = [];

  loading = false;

  error: string | null = null;

  chartDomPrefix = 'dynamicChart';

  constructor(
    private chartService: ChartService
  ) { }

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts(): void {

    this.loading = true;
    this.error = null;

    this.chartService.getChartsByPage(this.pageName)
      .subscribe({
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

    if (chart.chartType === 'bar') {
      this.renderBarChart(chart);
    }
  }

  renderBarChart(chart: ChartConfig): void {

    const data = [{
      x: ['Open', 'Closed', 'Pending'],
      y: [10, 20, 5],
      type: 'bar'
    }];

    const layout = {
      title: chart.title,
      height: chart.parameters && chart.parameters.height ? chart.parameters.height : 400
    };

    const config = {
      responsive: true
    };

    Plotly.react(this.getChartDomId(chart), data, layout, config);
  }
}