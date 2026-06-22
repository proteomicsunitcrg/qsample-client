import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from '../../../services/file.service';
import { RequestFile } from '../../../models/RequestFile';
import { PlotService } from '../../../services/plot.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-request-plot-file-list',
  templateUrl: './request-plot-file-list.component.html',
  styleUrls: ['./request-plot-file-list.component.css'],
})
export class RequestPlotFileListComponent implements OnInit, OnDestroy {
  constructor(
    private fileService: FileService,
    private plotService: PlotService
  ) {}

  files: RequestFile[] = [];
  @Input() requestCode: string;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnsToDisplay = ['show'];
  selectedSamples: RequestFile[] = [];

  orderSubscription$: Subscription;
  order: string;

  ngOnInit(): void {
    this.subscribeToOrder();
  }

  ngOnDestroy(): void {
    this.orderSubscription$.unsubscribe();
  }

  public getFilesByRequestCode(): void {
    // console.log( "FILE BY REQUEST ");
    // console.log( this.requestCode );
    // console.log( this.order );
    this.fileService.getFilesByRequestCode(this.requestCode, this.order).subscribe(
      (res) => {
        this.selectedSamples = [];
        this.files = res;
        // console.log( this.files );
        if (this.files !== null) {
          this.files.forEach((val) => this.selectedSamples.push(Object.assign({}, val))); // we need to clone
          this.dataSource = new MatTableDataSource(this.files);
          this.dataSource.paginator = this.paginator;
          this.plotService.sendselectedSamples(this.selectedSamples);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public listChange(file: RequestFile, $event: MatCheckboxChange): void {
    if ($event.checked) {
      if (!this.selectedSamples.find((i) => i.checksum === file.checksum)) {
        this.selectedSamples.push(file);
      }
      this.selectedSamples.sort((a, b) => a.filename.localeCompare(b.filename));
    } else {
      const index = this.selectedSamples.findIndex((i) => i.checksum === file.checksum);
      if (index !== -1) {
        this.selectedSamples.splice(index, 1);
      }
    }
    this.plotService.sendselectedSamples([...this.selectedSamples]);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public checkIfElementSelected(element: RequestFile): boolean {
    // TODO. This function is called every time the DOM updates so it is inefficient.
    return !!this.selectedSamples.find((e) => e.checksum === element.checksum);
  }

  private subscribeToOrder(): void {
    this.orderSubscription$ = this.plotService.selectedOrder.subscribe((order) => {
      this.order = order;
      this.getFilesByRequestCode();
    });
  }

  public changeOrder(newOrder: string): void {
    if (newOrder !== this.order) {
      this.plotService.sendselectedOrder(newOrder);
    }
  }
}
