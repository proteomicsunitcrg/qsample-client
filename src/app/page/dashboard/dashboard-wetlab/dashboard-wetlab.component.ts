import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WetLab } from 'src/app/models/WetLab';
import { FileService } from 'src/app/services/file.service';
import { WetLabService } from 'src/app/services/wetlab.service';

@Component({
  selector: 'app-dashboard-wetlab',
  templateUrl: './dashboard-wetlab.component.html',
  styleUrls: ['./dashboard-wetlab.component.css']
})
export class DashboardWetlabComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  datasource: MatTableDataSource<any>;

  columnsToDisplay = ['creation_date', 'filename'];

  allWetlabs: WetLab[] = [];

  allWetlabsOption = new WetLab(0, null, 'All', null, null);

  wetlab = this.allWetlabsOption;

  today = new Date();

  threeMonthsAgo = new Date(new Date().setMonth(this.today.getMonth() - 3));

  title = 'Recently processed sample preparation QC files';

  range = new FormGroup({
    start: new FormControl(this.threeMonthsAgo),
    end: new FormControl(this.today),
    filename: new FormControl(''),
    code: new FormControl('')
  });

  filename = '';

  constructor(
    private wetLabService: WetLabService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.getAllWetlabs();
    this.getAllWetlabFiles();
  }

  public getAllWetlabFiles(): void {
    const wetlabId = this.wetlab && this.wetlab.id ? this.wetlab.id : 0;

    this.fileService.getWetlabFilesDashboard(
      this.range.controls.end.value,
      this.range.controls.start.value,
      this.filename,
      wetlabId
    ).subscribe(
      (res) => {
        this.datasource = new MatTableDataSource(res);
        this.datasource.paginator = this.paginator;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public getAllWetlabs(): void {
    this.wetLabService.getWetlabLists().subscribe(
      (res) => {
        this.allWetlabs = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

}