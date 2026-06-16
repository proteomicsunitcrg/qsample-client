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
          if (!dataPoints || !dataPoints.some(point => this.hasRenderableValue(point.value))) {
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
        if (!dataPoints || !dataPoints.some(point => this.hasRenderableValue(point.value))) {
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
    return chart.chartMode === 'STACKED_BAR';
  }

  private isPercentChart(chart: ChartConfig): boolean {
    return chart.dataSourceKey === 'secondary_reactions' ||
      chart.dataSourceKey === 'polymer_contaminants';
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
        ticksuffix: '%',
        tickformat: '.1f'
      };
    }

    if (chart.name === 'identified_protein_groups' ||
      chart.name === 'identified_peptides' ||
      chart.dataSourceKey === '5008da3a-dbcd-49c3-a008-db34c4b0bb39' ||
      chart.dataSourceKey === 'missed_cleavages' ||
      chart.dataSourceKey === 'precursors_by_charge') {
      return {
        tickformat: 'd'
      };
    }

    return {
      exponentformat: 'power',
      showexponent: 'all',
      tickformat: '.0e'
    };
  }

  private hasRenderableValue(value: number): boolean {
    return Number(value) !== 0;
  }

  private getRenderableValue(value: number): number | null {
    return this.hasRenderableValue(value) ? value : null;
  }

  private formatHoverValue(chart: ChartConfig, value: number): string {
    if (this.isPercentChart(chart)) {
      return value.toFixed(2);
    }

    return `${value}`;
  }

  private getHoverTemplate(
    chart: ChartConfig,
    dataPoints: Array<{ creationDate: string | null }>
  ): string {
    const hasCreationDate = dataPoints.some(point => point.creationDate);
    const valueLabel = this.isPercentChart(chart)
      ? 'Value: %{text}%'
      : 'Value: %{text}';

    return hasCreationDate
      ? `${valueLabel}<br>Date: %{customdata[1]}<extra>%{customdata[2]}</extra>`
      : `${valueLabel}<extra>%{customdata[2]}</extra>`;
  }

  private getStackedHoverTemplate(
    chart: ChartConfig,
    dataPoints: Array<{ creationDate: string | null }>
  ): string {
    const hasCreationDate = dataPoints.some(point => point.creationDate);
    const valueLabel = this.isPercentChart(chart)
      ? 'Value: %{text}%'
      : 'Value: %{text}';

    return hasCreationDate
      ? `${valueLabel}<br>Series: %{fullData.name}<br>Date: %{customdata[1]}<extra>%{customdata[2]}</extra>`
      : `${valueLabel}<br>Series: %{fullData.name}<extra>%{customdata[2]}</extra>`;
  }

  private hasClickableChecksum(
    dataPoints: Array<{ checksum: string }>
  ): boolean {
    return dataPoints.some(point => !!point.checksum);
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
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#6baed6',
      '#ffbb78',
      '#98df8a',
      '#08519c',
      '#e6550d',
      '#238b45',
      '#9ecae1',
      '#fdae6b',
      '#a1d99b',
      '#08306b',
      '#a63603',
      '#006d2c',
      '#c6dbef'
    ];

    return groups.map(group => {
      if (!group || replicatedGroups.indexOf(group) === -1) {
        return defaultColor;
      }

      const index = replicatedGroups.indexOf(group) % palette.length;

      return palette[index];
    });
  }

  private getStackedSeriesColor(chart: ChartConfig, seriesIndex: number): string | null {
    const styledStackedCharts = [
      'secondary_reactions',
      'polymer_contaminants'
    ];

    if (styledStackedCharts.indexOf(chart.dataSourceKey) === -1) {
      return null;
    }

    const palette = [
      '#4E79A7',
      '#F28E2B',
      '#59A14F',
      '#E15759',
      '#76B7B2',
      '#EDC948',
      '#B07AA1',
      '#FF9DA7',
      '#9C755F',
      '#BAB0AC',
      '#86BCB6',
      '#D37295',
      '#A0CBE8',
      '#FFBE7D',
      '#8CD17D',
      '#F1CE63'
    ];

    return palette[seriesIndex % palette.length];
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
      y: dataPoints.map(point => this.getRenderableValue(point.value)),
      marker: {
        color: this.getProteinGroupBarColors(chart, labels)
      },
      customdata: dataPoints.map(point => [
        point.checksum,
        point.creationDate,
        point.label
      ]),
      text: dataPoints.map(point =>
        this.hasRenderableValue(point.value)
          ? this.formatHoverValue(chart, point.value)
          : null
      ),
      hovertemplate: this.getHoverTemplate(chart, dataPoints),
      type: 'bar'
    }];

    const layout = {
      autosize: true,
      hovermode: 'closest',
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
      seriesNames = ['2', '1', '0']
        .filter(series => seriesNames.includes(series));
    }

    if (chart.dataSourceKey === 'precursors_by_charge') {
      seriesNames = ['+4', '+3', '+2']
        .filter(series => seriesNames.includes(series));
    }

    seriesNames = seriesNames.filter(seriesName =>
      dataPoints.some(point =>
        point.series === seriesName &&
        this.hasRenderableValue(point.value)
      )
    );

    const labels = Array.from(
      new Set(
        dataPoints.map(point => this.formatLabel(chart, point.label))
      )
    );

    const data = seriesNames.map((seriesName, seriesIndex) => {
      const seriesColor = this.getStackedSeriesColor(chart, seriesIndex);

      const trace: any = {
        x: labels,

        y: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.formatLabel(chart, point.label) === label &&
              point.series === seriesName
          );

          return match ? this.getRenderableValue(match.value) : null;
        }),

        name: seriesName,

        customdata: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.formatLabel(chart, point.label) === label &&
              point.series === seriesName
          );

          return match && this.hasRenderableValue(match.value)
            ? [match.checksum, match.creationDate, match.label]
            : ['', '', ''];
        }),

        text: labels.map(label => {
          const match = dataPoints.find(
            point =>
              this.formatLabel(chart, point.label) === label &&
              point.series === seriesName
          );

          return match && this.hasRenderableValue(match.value)
            ? this.formatHoverValue(chart, match.value)
            : null;
        }),

        hovertemplate: this.getStackedHoverTemplate(chart, dataPoints),

        type: 'bar'
      };

      if (seriesColor) {
        trace.marker = { color: seriesColor };
      }

      return trace;
    });

    const layout = {
      autosize: true,
      barmode: 'stack',
      hovermode: 'closest',
      yaxis: this.getYAxisLayout(chart),
      height: chart.parameters && chart.parameters.height
        ? chart.parameters.height
        : 400
    };

    const config = {
      responsive: true
    };

    const plotData = chart.dataSourceKey === 'missed_cleavages' ||
      chart.dataSourceKey === 'precursors_by_charge'
      ? [...data].reverse()
      : data;

    this.renderPlotlyChart(
      chart,
      plotData,
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
