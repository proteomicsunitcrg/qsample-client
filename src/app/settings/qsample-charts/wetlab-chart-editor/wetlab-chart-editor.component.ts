import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WetLab } from '../../../models/WetLab';
import { WetLabService } from '../../../services/wetlab.service';
import {
  ChartDataSource,
  ChartDataSourceOptions,
  ChartDataSourceSave,
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
  dataSources: ChartDataSource[] = [];
  dataSourceOptions: ChartDataSourceOptions;

  selectedExistingPlotId: number;
  editingPlotId: number;
  dataSourceForm: ChartDataSourceSave = {
    name: '',
    paramId: undefined,
    contextSourceIds: []
  };

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

  private loadDataSources(): void {
    this.chartService.getChartDataSources().subscribe(
      res => {
        this.dataSources = res;
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading data sources', 'Close');
      }
    );
  }

  private loadDataSourceOptions(): void {
    this.chartService.getChartDataSourceOptions().subscribe(
      res => {
        this.dataSourceOptions = res;
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading data source options', 'Close');
      }
    );
  }

  public linkExistingDataSource(): void {
    if (!this.selectedExistingPlotId) {
      this.openSnackBar('Select a data source first', 'Close');
      return;
    }

    this.chartService.linkWetlabDataSource(
      this.wetlabId,
      this.selectedExistingPlotId
    ).subscribe(
      () => {
        this.selectedExistingPlotId = undefined;
        this.loadPlotConfigs();
        this.openSnackBar('Data source linked to WetLab', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error linking data source to WetLab', 'Close');
      }
    );
  }

  public canSaveDataSource(): boolean {
    return !!this.dataSourceForm.name &&
      !!this.dataSourceForm.paramId &&
      !!this.dataSourceForm.contextSourceIds &&
      this.dataSourceForm.contextSourceIds.length > 0;
  }

  public getContextSourceLabel(contextSource): string {
    if (!contextSource) {
      return '';
    }

    return contextSource.abbreviated
      ? `${contextSource.name} (${contextSource.abbreviated})`
      : contextSource.name;
  }

  public saveDataSource(): void {
    if (!this.dataSourceForm.name || !this.dataSourceForm.paramId ||
        !this.dataSourceForm.contextSourceIds ||
        this.dataSourceForm.contextSourceIds.length === 0) {
      this.openSnackBar('Name, param and at least one context source are required', 'Close');
      return;
    }

    const dataSource: ChartDataSourceSave = {
      name: this.dataSourceForm.name.trim(),
      paramId: this.dataSourceForm.paramId,
      contextSourceIds: this.dataSourceForm.contextSourceIds
    };

    if (this.editingPlotId) {
      this.chartService.updateWetlabDataSource(
        this.wetlabId,
        this.editingPlotId,
        dataSource
      ).subscribe(
        () => {
          this.cancelDataSourceEdit();
          this.loadPlotConfigs();
          this.loadDataSources();
          this.openSnackBar('WetLab data source updated', 'Close');
        },
        err => {
          console.error(err);
          this.openSnackBar('Error updating WetLab data source', 'Close');
        }
      );

      return;
    }

    this.chartService.createWetlabDataSource(
      this.wetlabId,
      dataSource
    ).subscribe(
      () => {
        this.cancelDataSourceEdit();
        this.loadPlotConfigs();
        this.loadDataSources();
        this.openSnackBar('WetLab data source created', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error creating WetLab data source', 'Close');
      }
    );
  }

  public editDataSource(config: WetlabPlotConfig): void {
    this.chartService.getChartDataSource(config.plotId).subscribe(
      dataSource => {
        this.editingPlotId = config.plotId;
        this.dataSourceForm = {
          name: dataSource.name,
          paramId: dataSource.paramId,
          contextSourceIds: dataSource.contextSources.map(source => source.id)
        };
      },
      err => {
        console.error(err);
        this.openSnackBar('Error loading data source', 'Close');
      }
    );
  }

  public cancelDataSourceEdit(): void {
    this.editingPlotId = undefined;
    this.dataSourceForm = {
      name: '',
      paramId: undefined,
      contextSourceIds: []
    };
  }

  public unlinkDataSource(config: WetlabPlotConfig): void {
    if (!window.confirm(`Remove data source "${config.plotName}" from this WetLab?`)) {
      return;
    }

    this.chartService.unlinkWetlabDataSource(
      this.wetlabId,
      config.plotId
    ).subscribe(
      () => {
        if (this.editingPlotId === config.plotId) {
          this.cancelDataSourceEdit();
        }

        this.loadPlotConfigs();
        this.openSnackBar('Data source removed from WetLab', 'Close');
      },
      err => {
        console.error(err);
        this.openSnackBar('Error removing data source from WetLab', 'Close');
      }
    );
  }

  public toggleContextSource(contextSourceId: number, checked: boolean): void {
    const selected = this.dataSourceForm.contextSourceIds || [];

    if (checked && selected.indexOf(contextSourceId) === -1) {
      selected.push(contextSourceId);
    }

    if (!checked) {
      const index = selected.indexOf(contextSourceId);
      if (index !== -1) {
        selected.splice(index, 1);
      }
    }

    this.dataSourceForm.contextSourceIds = selected;
  }

  public isContextSourceSelected(contextSourceId: number): boolean {
    return this.dataSourceForm.contextSourceIds &&
      this.dataSourceForm.contextSourceIds.indexOf(contextSourceId) !== -1;
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
