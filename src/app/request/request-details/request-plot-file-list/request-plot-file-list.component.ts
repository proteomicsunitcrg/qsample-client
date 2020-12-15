import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from '../../../services/file.service';
import { File } from '../../../models/File';
import { RequestFile } from '../../../models/RequestFile';
import { PlotService } from '../../../services/plot.service';

@Component({
  selector: 'app-request-plot-file-list',
  templateUrl: './request-plot-file-list.component.html',
  styleUrls: ['./request-plot-file-list.component.css']
})
export class RequestPlotFileListComponent implements OnInit {

  constructor(private fileService: FileService, private plotService: PlotService) {
  }

  files: RequestFile[] = [];
  @Input('requestCode') requestCode: string;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnsToDisplay = ['show'];
  selectedSamples: File[] = [];

  ngOnInit(): void {
    console.log(this.requestCode);
    this.fileService.getFilesByRequestCode(this.requestCode).subscribe(
      res => {
        this.files = res;
        this.selectedSamples = res;
        if (this.files !== null) {
          this.dataSource = new MatTableDataSource(this.files);
          this.dataSource.paginator = this.paginator;
          this.plotService.sendselectedSamples(this.selectedSamples);
        }
      },
      err => {
        console.error(err);
      }
    );
  }


  public listChange(file: File, $event: MatCheckboxChange): void {
    if ($event.checked) {
      this.selectedSamples.push(file);
    } else {
      this.selectedSamples.splice(this.selectedSamples.indexOf(file), 1);
    }
    this.plotService.sendselectedSamples(this.selectedSamples);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
