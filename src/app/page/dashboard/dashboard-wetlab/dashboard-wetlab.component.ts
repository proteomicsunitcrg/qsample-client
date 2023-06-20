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

  constructor(private wetLabService: WetLabService, private fileService: FileService, private wetlabService: WetLabService) { }


  datasource: MatTableDataSource<any>;

  columnsToDisplay = ['creation_date', 'filename'];

  allWetlabs: WetLab[] = []

  today = new Date();

  title: string;

  monthAgo = new Date(new Date().setMonth(this.today.getMonth() - 6));

  range = new FormGroup({
    start: new FormControl(this.monthAgo),
    end: new FormControl(this.today),
    filename: new FormControl(''),
    code: new FormControl('')
  });

  filename = '';
  wetlab = new WetLab(0, null, null, null, null);

  ngOnInit(): void {

    this.title = 'Last processed sample preparation QC files';

  // if ( ! window['env']['local_requests']  ) { # TODO: Migrate
    if ( this.wetLabService.apiPrefix.includes('qsample.crg.eu') ) {
      // this.title = window['env']['general-wetlab-production']; # TODO: Migrate
      this.title = 'Last processed wetlab files';
    }

    this.getAllWetlabs()
    this.getAllWetlabFiles();
  }

  public getAllWetlabFiles(): void {
    if (this.wetlab === undefined) {
      this.wetlab.id = 0;
    }
    this.fileService.getWetlabFilesDashboard(this.today, this.monthAgo, this.filename, this.wetlab.id).subscribe(
      res => {
        this.datasource = new MatTableDataSource(res);
        this.datasource.paginator = this.paginator;
      },
      err => {
        console.error(err);
      }
    );
  }

  public getAllWetlabs(): void {
    this.wetlabService.getWetlabLists().subscribe(
      res => {
        this.allWetlabs = res;
      },
      err => {
        console.error(err);
      }
    );
  }

}
