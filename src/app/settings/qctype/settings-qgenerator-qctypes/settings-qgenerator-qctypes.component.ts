import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { QCtype } from 'src/app/models/QCtype';
import { QCtypeService } from 'src/app/services/qctype.service';

@Component({
  selector: 'app-settings-qgenerator-qctypes',
  templateUrl: './settings-qgenerator-qctypes.component.html',
  styleUrls: ['./settings-qgenerator-qctypes.component.css'],
})
export class SettingsQgeneratorQCtypesComponent implements OnInit {
  constructor(
    private qctypeService: QCtypeService,
    private router: Router
  ) {}

  columnsToDisplay = ['name'];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.getAllQCtypes();
  }

  private getAllQCtypes(): void {
    this.qctypeService.getAll().subscribe(
      (res) => {
        const filtered = res.filter((qctype) => qctype.name !== null);
        this.dataSource = new MatTableDataSource(filtered);
        this.dataSource.data = this.dataSource.data.sort((a, b) => a.name.localeCompare(b.name));
      },
      (err) => {
        console.error(err);
      }
    );
  }
  public edit(app: QCtype): void {
    this.router.navigate(['/settings/QGenerator/qctypes/editor/', app.id]);
  }

  public newQCtype(): void {
    this.router.navigate(['/settings/QGenerator/qctypes/editor/', 'new']);
  }
}
