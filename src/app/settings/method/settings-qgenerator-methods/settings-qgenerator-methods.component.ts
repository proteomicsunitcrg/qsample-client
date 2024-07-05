import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Method } from 'src/app/models/Method';
import { MethodService } from 'src/app/services/method.service';

@Component({
  selector: 'app-settings-qgenerator-methods',
  templateUrl: './settings-qgenerator-methods.component.html',
  styleUrls: ['./settings-qgenerator-methods.component.css']
})
export class SettingsQgeneratorMethodsComponent implements OnInit {

  constructor(private applicationService: MethodService, private router: Router) { }


  columnsToDisplay = ['name'];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAllApplications();
  }

  private getAllApplications(): void {
    this.applicationService.getAll().subscribe(
      res => {
        // console.log(res);

        this.dataSource = new MatTableDataSource(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  public edit(app: Method): void {
    this.router.navigate(['/settings/QGenerator/methods/editor/', app.id]);
  }

  public newMethod(): void {
    this.router.navigate(['/settings/QGenerator/methods/editor/', 'new']);
  }

}
