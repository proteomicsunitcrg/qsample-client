import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Application } from '../../models/Application';
import { WetLab } from '../../models/WetLab';
import { ApplicationService } from '../../services/application.service';
import { WetLabService } from '../../services/wetlab.service';

@Component({
  selector: 'app-settings-qsample-charts',
  templateUrl: './settings-qsample-charts.component.html',
  styleUrls: ['./settings-qsample-charts.component.css']
})
export class SettingsQsampleChartsComponent implements OnInit {

  columnsToDisplay = ['name', 'action'];
  applicationDataSource: MatTableDataSource<Application>;
  wetlabDataSource: MatTableDataSource<WetLab>;

  constructor(
    private applicationService: ApplicationService,
    private wetLabService: WetLabService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllApplications();
    this.getAllWetlabs();
  }

  private getAllApplications(): void {
    this.applicationService.getAll().subscribe(
      res => {
        this.applicationDataSource = new MatTableDataSource(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  private getAllWetlabs(): void {
    this.wetLabService.getWetlabLists().subscribe(
      res => {
        this.wetlabDataSource = new MatTableDataSource(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  public editCharts(application: Application): void {
    this.router.navigate([
      '/settings/qsample/charts/application',
      application.id
    ]);
  }

  public editWetlabCharts(wetlab: WetLab): void {
    this.router.navigate([
      '/settings/qsample/charts/wetlab',
      wetlab.id
    ]);
  }

}
