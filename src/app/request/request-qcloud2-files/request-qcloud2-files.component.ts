import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FileService } from '../../services/file.service';
import { QCloud2File } from '../../models/QCloud2File';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestService } from '../../services/request.service';
import { Observable, Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NonConformitiesDialogComponent } from './dialog/non-conformities-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-request-qcloud2-files',
  templateUrl: './request-qcloud2-files.component.html',
  styleUrls: ['./request-qcloud2-files.component.css']
})
export class RequestQcloud2FilesComponent implements OnInit, OnDestroy {

  myEventSubscription: Subscription;

  constructor(private fileService: FileService, private requestService: RequestService, private dialog: MatDialog) {
    this.myEventSubscription = this.requestService.currentRequestCode.subscribe(value => {
      if (value !== undefined) {
        this.requestCode = value;
        this.getQCloud2Files();
      }
    }
    );

  }

  // tslint:disable-next-line:no-input-rename
  @Input('request') requestCode: string;

  qCloud2Files: QCloud2File[] = [];

  nonConformityFiles: QCloud2File[] = [];

  error: HttpErrorResponse;

  columnsToDisplay = ['filename', 'conformity'];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  errorCounter = 0;


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.myEventSubscription.unsubscribe();
  }

  private getQCloud2Files(): void {
    // console.log(this.requestCode);
    this.fileService.getQCloud2Files(this.requestCode).subscribe(
      res => {
        console.log(res);

        this.qCloud2Files = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        for (const file of this.qCloud2Files) {
          if (file.conformity !== 'OK') {
            this.errorCounter += 1;
            this.nonConformityFiles.push(file);
          }
        }

      },
      err => {
        console.error(err);
        this.error = err;
      }
    );
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(NonConformitiesDialogComponent, {
      data: {
        files: this.nonConformityFiles
      },
      width: '35%'
    });
  }

}
