import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WetLab } from '../../../models/WetLab';
import { WetLabService } from '../../../services/wetlab.service';
import {
  ChartService,
  WetlabPlotConfig,
  WetlabPlotConfigSave
} from '../../../services/chart.service';

@Component({
  selector: 'app-wetlab-chart-editor',
  templateUrl: './wetlab-chart-editor.component.html',
  styleUrls: ['./wetlab-chart-editor.component.css']
})
export class WetlabChartEditorComponent implements OnInit {

  wetlabId: number;
  wetlab: WetLab;
  plotConfigs: WetlabPlotConfig[] = [];

  columnsToDisplay = ['enabled', 'orderIndex', 'plotName', 'actions'];

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
        this.loadPlotConfigs();
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

  private loadPlotConfigs(): void {
    this.chartService.getWetlabPlotConfig(this.wetlabId).subscribe(
      res => {
        this.plotConfigs = res;
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading WetLab chart configuration', 'Close');
      }
    );
  }

  public initializePlots(): void {
    this.chartService.initializeWetlabPlotConfig(this.wetlabId).subscribe(
      res => {
        this.plotConfigs = res;
        this.openSnackBar('WetLab chart configuration initialized', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error initializing WetLab chart configuration', 'Close');
      }
    );
  }

  public savePlots(): void {
    const configsToSave: WetlabPlotConfigSave[] =
      this.plotConfigs.map(config => ({
        plotId: config.plotId,
        enabled: config.enabled,
        orderIndex: config.orderIndex
      }));

    this.chartService.saveWetlabPlotConfig(
      this.wetlabId,
      configsToSave
    ).subscribe(
      res => {
        this.plotConfigs = res;
        this.openSnackBar('WetLab chart configuration saved', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error saving WetLab chart configuration', 'Close');
      }
    );
  }

  public movePlotUp(index: number): void {
    if (index <= 0) {
      return;
    }

    const previous = this.plotConfigs[index - 1];
    this.plotConfigs[index - 1] = this.plotConfigs[index];
    this.plotConfigs[index] = previous;

    this.recalculatePlotOrder();
  }

  public movePlotDown(index: number): void {
    if (index >= this.plotConfigs.length - 1) {
      return;
    }

    const next = this.plotConfigs[index + 1];
    this.plotConfigs[index + 1] = this.plotConfigs[index];
    this.plotConfigs[index] = next;

    this.recalculatePlotOrder();
  }

  private recalculatePlotOrder(): void {
    this.plotConfigs = this.plotConfigs.map((config, index) => ({
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
