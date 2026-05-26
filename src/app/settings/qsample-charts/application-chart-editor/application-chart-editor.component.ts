import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Application } from '../../../models/Application';
import { ApplicationService } from '../../../services/application.service';
import {
  ApplicationChartConfig,
  ApplicationChartConfigSave,
  ChartService
} from '../../../services/chart.service';

@Component({
  selector: 'app-application-chart-editor',
  templateUrl: './application-chart-editor.component.html',
  styleUrls: ['./application-chart-editor.component.css']
})
export class ApplicationChartEditorComponent implements OnInit {

  applicationId: number;
  application: Application;
  chartConfigs: ApplicationChartConfig[] = [];

  columnsToDisplay = ['enabled', 'orderIndex', 'chartTitle', 'actions'];

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
        this.loadChartConfigs();
      },
      err => {
        console.error(err);
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

  private loadChartConfigs(): void {
    this.chartService.getApplicationChartConfig(this.applicationId).subscribe(
      res => {
        this.chartConfigs = res;
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
        this.chartConfigs = res;
        this.openSnackBar('Chart configuration initialized', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error initializing chart configuration', 'Close');
      }
    );
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
        this.chartConfigs = res;
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

  private recalculateChartOrder(): void {
    this.chartConfigs = this.chartConfigs.map((config, index) => ({
      ...config,
      orderIndex: index + 1
    }));
  }

  public goBack(): void {
    this.router.navigate(['/settings/qsample/charts']);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}