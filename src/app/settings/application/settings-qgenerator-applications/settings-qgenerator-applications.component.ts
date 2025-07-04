import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from '../../../models/Application';

@Component({
  selector: 'app-settings-qgenerator-applications',
  templateUrl: './settings-qgenerator-applications.component.html',
  styleUrls: ['./settings-qgenerator-applications.component.css'],
})
export class SettingsQgeneratorApplicationsComponent implements OnInit {
  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  columnsToDisplay = ['name'];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAllApplications();
  }

  private getAllApplications(): void {
    this.applicationService.getAll().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.data = this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public edit(app: Application): void {
    this.router.navigate(['/settings/QGenerator/applications/editor/', app.id]);
  }

  public newSystem(): void {
    this.router.navigate(['/settings/QGenerator/applications/editor/', 'new']);
  }
}
