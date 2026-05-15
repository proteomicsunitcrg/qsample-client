import { Component, Input, OnInit } from '@angular/core';

import { ChartService } from '../../services/chart.service';
import { ChartConfig } from '../../models/chart-config.model';

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
        },
        error: () => {
          this.error = 'Failed to load charts';
          this.loading = false;
        }
      });
  }
}
