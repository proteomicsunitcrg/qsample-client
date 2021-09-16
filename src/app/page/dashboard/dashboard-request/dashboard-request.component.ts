import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-dashboard-request',
  templateUrl: './dashboard-request.component.html',
  styleUrls: ['./dashboard-request.component.css']
})
export class DashboardRequestComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private fileService: FileService) { }

  datasource: MatTableDataSource<any>;

  columnsToDisplay = ['creation_date', 'filename', 'requestCode', 'checksum'];

  today = new Date();

  monthAgo = new Date(new Date().setMonth(this.today.getMonth() - 6));

  range = new FormGroup({
    start: new FormControl(this.monthAgo),
    end: new FormControl(this.today),
    filename: new FormControl(''),
    code: new FormControl('')
  });

  filename = '';
  code = '';


  ngOnInit(): void {
    this.getAllRequestFiles();
  }

  public getAllRequestFiles(): void {
    this.fileService.getRequestFilesDashboard(this.today, this.monthAgo, this.filename, this.code).subscribe(
      res => {
        this.datasource = new MatTableDataSource(res);
        this.datasource.paginator = this.paginator;
      },
      err => {
        console.error(err);
      }
    );

  }

}
