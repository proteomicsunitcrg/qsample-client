import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { interval, Subscription } from 'rxjs';
import { FileService } from '../../../services/file.service';
import { RequestFileStatusService } from '../../../services/request-file-status.service';
import { RequestFile } from '../../../models/RequestFile';
import { RequestFileStatus } from '../../../models/RequestFileStatus';
import { PlotService } from '../../../services/plot.service';
import { RequestFileStatusErrorDialogComponent } from './dialog/request-file-status-error-dialog.component';

// A file's processing status isn't pushed live - it's recomputed every time
// we poll, same as QCloud2's Pipeline Status tab. Only polls while at least
// one file is still RECEIVED/PROCESSING, so an all-settled request stays idle.
const STATUS_POLL_INTERVAL_MS = 10000;

@Component({
  selector: 'app-request-plot-file-list',
  templateUrl: './request-plot-file-list.component.html',
  styleUrls: ['./request-plot-file-list.component.css'],
})
export class RequestPlotFileListComponent implements OnInit, OnDestroy {
  constructor(
    private fileService: FileService,
    private requestFileStatusService: RequestFileStatusService,
    private plotService: PlotService,
    private dialog: MatDialog
  ) {}

  files: RequestFile[] = [];
  @Input() requestCode: string;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnsToDisplay = ['status', 'show'];
  selectedSamples: RequestFile[] = [];

  statuses: { [checksum: string]: RequestFileStatus } = {};

  filterText = '';
  statusFilterValue = 'ALL';

  orderSubscription$: Subscription;
  fileRemovedSubscription$: Subscription;
  statusPollSubscription$: Subscription;
  order: string;

  ngOnInit(): void {
    this.subscribeToOrder();
    this.subscribeToFileRemoved();
    this.statusPollSubscription$ = interval(STATUS_POLL_INTERVAL_MS).subscribe(() => {
      if (this.hasInFlightFiles()) {
        this.refreshStatuses();
      }
    });
  }

  ngOnDestroy(): void {
    this.orderSubscription$.unsubscribe();
    this.fileRemovedSubscription$.unsubscribe();
    this.statusPollSubscription$.unsubscribe();
  }

  public getFilesByRequestCode(): void {
    this.fileService.getFilesByRequestCode(this.requestCode, this.order).subscribe(
      (res) => {
        this.selectedSamples = [];
        this.files = res;
        if (this.files !== null) {
          this.files.forEach((val) => this.selectedSamples.push(Object.assign({}, val))); // we need to clone
          this.dataSource = new MatTableDataSource(this.files);
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = this.createFilterPredicate();
          // Valid JSON from the start (the predicate JSON.parses the filter
          // string) - doesn't touch selectedSamples, matching the pre-existing
          // "select everything on load" behaviour regardless of filter state.
          this.dataSource.filter = this.currentFilterString();
          this.plotService.sendselectedSamples(this.selectedSamples);
          this.refreshStatuses();
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
    this.filterText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyCombinedFilter();
  }

  public applyStatusFilter(): void {
    this.applyCombinedFilter();
  }

  public checkIfElementSelected(element: RequestFile): boolean {
    // TODO. This function is called every time the DOM updates so it is inefficient.
    return !!this.selectedSamples.find((e) => e.checksum === element.checksum);
  }

  public statusFor(file: RequestFile): RequestFileStatus | undefined {
    return this.statuses[file.checksum];
  }

  public statusIcon(file: RequestFile): string {
    const status = this.statusFor(file)?.status;
    switch (status) {
      case 'RECEIVED':
      case 'PROCESSING':
        return 'hourglass_empty';
      case 'PROCESSED':
        return 'check_circle';
      case 'ERROR':
        return 'error';
      default:
        return '';
    }
  }

  public statusTooltip(file: RequestFile): string {
    const entry = this.statusFor(file);
    if (!entry) {
      return '';
    }
    switch (entry.status) {
      case 'RECEIVED':
      case 'PROCESSING':
        return `Processing since ${this.formatDuration(entry.receivedDate, new Date())}`;
      case 'PROCESSED':
        return `Everything went fine (took ${this.formatDuration(entry.processingStartedDate || entry.receivedDate, entry.updatedDate)})`;
      case 'ERROR':
        return 'Processing failed - click for details';
      default:
        return '';
    }
  }

  public onStatusClick(file: RequestFile): void {
    const entry = this.statusFor(file);
    if (entry?.status === 'ERROR') {
      this.dialog.open(RequestFileStatusErrorDialogComponent, {
        data: { filename: file.filename, status: entry },
        width: '45%'
      });
    }
  }

  private refreshStatuses(): void {
    if (!this.requestCode) {
      return;
    }
    this.requestFileStatusService.getByRequestCode(this.requestCode).subscribe(
      (res) => {
        this.statuses = res || {};
        if (this.order === 'pipeline' && this.dataSource) {
          this.dataSource.data = this.sortByPipelineEntry(this.dataSource.data);
        }
        // Re-run the filter predicate so an active Status filter reflects
        // newly polled statuses, without resetting pagination/selection -
        // that's a user-driven action, not something a background poll
        // should do underneath them.
        if (this.dataSource) {
          this.dataSource.filter = this.currentFilterString();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private currentFilterString(): string {
    return JSON.stringify({ text: this.filterText, status: this.statusFilterValue });
  }

  private applyCombinedFilter(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = this.currentFilterString();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    const filteredSamples = this.dataSource.filteredData || this.files;
    this.selectedSamples = filteredSamples.map((file) => Object.assign({}, file));
    this.plotService.sendselectedSamples([...this.selectedSamples]);
  }

  private createFilterPredicate(): (data: RequestFile, filter: string) => boolean {
    return (data: RequestFile, filter: string): boolean => {
      const { text, status } = JSON.parse(filter);
      const matchesText = !text || data.filename.toLowerCase().includes(text);
      const entryStatus = this.statusFor(data)?.status ?? 'NONE';
      const matchesStatus = !status || status === 'ALL' || entryStatus === status;
      return matchesText && matchesStatus;
    };
  }

  private sortByPipelineEntry(files: RequestFile[]): RequestFile[] {
    // Newest pipeline entry first; files with no status yet (not received by
    // Atlas yet) sink to the bottom since they have no date to sort by.
    return [...files].sort((a, b) => {
      const aDate = this.statuses[a.checksum]?.receivedDate;
      const bDate = this.statuses[b.checksum]?.receivedDate;
      if (!aDate && !bDate) {
        return 0;
      }
      if (!aDate) {
        return 1;
      }
      if (!bDate) {
        return -1;
      }
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }

  private hasInFlightFiles(): boolean {
    return Object.values(this.statuses).some((s) => s.status === 'RECEIVED' || s.status === 'PROCESSING');
  }

  private formatDuration(from: Date | string, to: Date | string): string {
    if (!from) {
      return 'unknown';
    }
    const start = new Date(from).getTime();
    const end = new Date(to).getTime();
    const totalSeconds = Math.max(0, Math.round((end - start) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }

  private subscribeToOrder(): void {
    this.orderSubscription$ = this.plotService.selectedOrder.subscribe((order) => {
      this.order = order;
      this.getFilesByRequestCode();
    });
  }

  private subscribeToFileRemoved(): void {
    this.fileRemovedSubscription$ = this.plotService.getFileRemoved().subscribe(() => {
      this.getFilesByRequestCode();
    });
  }

  public changeOrder(newOrder: string): void {
    if (newOrder !== this.order) {
      this.plotService.sendselectedOrder(newOrder);
    }
  }
}
