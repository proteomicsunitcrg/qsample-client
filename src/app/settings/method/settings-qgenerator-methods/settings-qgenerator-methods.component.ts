import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Method } from 'src/app/models/Method';
import { MethodService } from 'src/app/services/method.service';

@Component({
  selector: 'app-settings-qgenerator-methods',
  templateUrl: './settings-qgenerator-methods.component.html',
  styleUrls: ['./settings-qgenerator-methods.component.css'],
})
export class SettingsQgeneratorMethodsComponent implements OnInit {
  constructor(
    private methodService: MethodService,
    private router: Router
  ) {}

  columnsToDisplay = ['name'];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAllMethods();
  }

  private getAllMethods(): void {
    this.methodService.getAll().subscribe(
      (res) => {
        const filtered = res.filter((method) => method.name !== null);
        this.dataSource = new MatTableDataSource(filtered);
        this.dataSource.data = this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
      },
      (err) => {
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
