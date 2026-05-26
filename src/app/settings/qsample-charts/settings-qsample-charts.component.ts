import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Application } from '../../models/Application';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-settings-qsample-charts',
  templateUrl: './settings-qsample-charts.component.html',
  styleUrls: ['./settings-qsample-charts.component.css']
})
export class SettingsQsampleChartsComponent implements OnInit {

  columnsToDisplay = ['name', 'action'];
  dataSource: MatTableDataSource<Application>;

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllApplications();
  }

  private getAllApplications(): void {
    this.applicationService.getAll().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
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

}