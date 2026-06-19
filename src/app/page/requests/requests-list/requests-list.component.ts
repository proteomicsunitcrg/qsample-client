import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { RequestStatus } from '../../../models/RequestStatus';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { MiniRequest } from '../../../models/MiniRequest';
import { MatDialog } from '@angular/material/dialog';
import { RequestListYearSelectorDialog } from './dialog/request-list-year-selector-dialog';
import { SessionStorage } from '../../../services/sessionStorage.service';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css'],
})
export class RequestsListComponent implements OnInit {
  dataSource: MatTableDataSource<MiniRequest>;

  allRequests: MiniRequest[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  classFilter = '';

  statusFilter = '';

  creatorFilter = '';

  lastFieldFilter = '';

  subscription: Subscription;

  isInternal: boolean;

  agendoStatus: 'idle' | 'checking' | 'online' | 'offline' = 'idle';
  requestLoadError: 'none' | 'auth' | 'agendo' | 'generic' = 'none';

  columnsToDisplay = ['code', 'hasData', 'type', 'creatorName', 'creationDate', 'status'];

  filteredValues = {};

  showAll = false;

  today = new Date();

  threeMonthsAgo = new Date(new Date().setMonth(this.today.getMonth() - 3));

  finding = false;

  range = new FormGroup({
    start: new FormControl(this.threeMonthsAgo),
    end: new FormControl(this.today),
  });

  year: number;

  private readonly requestDateRangeStorageKey = 'qsample.requests.dateRange';

  @Input('settingsMode') settingsMode: boolean;

  constructor(
    private requestService: RequestService,
    private sessionStorageService: SessionStorage,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.subscription = this.authService.getIsInternal().subscribe((res) => (this.isInternal = res));
  }

  requestStatusValues = RequestStatus;

  requestStatusValuesKeys(): Array<string> {
    const keys = Object.keys(this.requestStatusValues);
    return keys.slice(keys.length / 2);
  }

  ngOnInit(): void {
    this.allRequests = [];
    this.dataSource = new MatTableDataSource<MiniRequest>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.setFilterPredicate();
    this.setSortData();
    this.restoreDateRange();
    this.getAllRequests();
  }

  private resetAllFilters(): void {
    this.classFilter = '';
    this.statusFilter = '';
    this.creatorFilter = '';
    this.lastFieldFilter = '';
  }

  private setFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: MiniRequest, filtersJson: string): boolean => {
      const filters = JSON.parse(filtersJson);

      return filters.every((filter) => {
        const value = filter.value ? filter.value.toString().toLowerCase() : '';

        if (!value) {
          return true;
        }

        if (!data[filter.id]) {
          return false;
        }

        return data[filter.id].toString().toLowerCase().indexOf(value) !== -1;
      });
    };
  }

  private applyFilters(): void {
    if (!this.dataSource) {
      return;
    }

    const tableFilters = [
      {
        id: 'type',
        value: this.classFilter,
      },
      {
        id: 'status',
        value: this.statusFilter,
      },
      {
        id: 'creatorName',
        value: this.creatorFilter,
      },
      {
        id: 'lastField',
        value: this.lastFieldFilter,
      },
    ];

    this.dataSource.filter = JSON.stringify(tableFilters);
  }

  applyFilterStatus(filterValue: string): void {
    this.statusFilter = filterValue;
    this.applyFilters();
  }

  applyFilterClass(filterValue: string): void {
    this.classFilter = filterValue;
    this.applyFilters();
  }

  applyFilterCreator(filterValue: string): void {
    this.creatorFilter = filterValue;
    this.applyFilters();
  }

  applyFilterCode(filterValue: string): void {
    this.lastFieldFilter = filterValue;
    this.applyFilters();
  }

  public searchLastMonths(months: number): void {
    const endDate = new Date();
    const startDate = new Date();

    startDate.setMonth(endDate.getMonth() - months);

    this.range.controls.start.setValue(startDate);
    this.range.controls.end.setValue(endDate);

    this.getAllRequests();
  }

  private restoreDateRange(): void {
    const savedRange = window.sessionStorage.getItem(this.requestDateRangeStorageKey);

    if (!savedRange) {
      return;
    }

    try {
      const parsedRange = JSON.parse(savedRange);

      if (parsedRange && parsedRange.start && parsedRange.end) {
        this.range.controls.start.setValue(new Date(parsedRange.start));
        this.range.controls.end.setValue(new Date(parsedRange.end));
      }
    } catch (err) {
      window.sessionStorage.removeItem(this.requestDateRangeStorageKey);
    }
  }

  private storeCurrentDateRange(): void {
    const start = this.range.controls.start.value;
    const end = this.range.controls.end.value;

    if (!start || !end) {
      return;
    }

    window.sessionStorage.setItem(
      this.requestDateRangeStorageKey,
      JSON.stringify({
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      })
    );
  }

  public getAllRequests(): void {
    this.storeCurrentDateRange();

    if (this.isInternal) {
      this.getAllRequestsInternal();
    } else {
      this.getAllRequestsExternal();
    }
  }

  public navigateToRequestCode(requestCode: string): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/request', requestCode])
    );

    window.open(url, '_blank');
  }

  public getAllRequestsInternal(): void {
    this.finding = true;
    this.agendoStatus = 'checking';
    this.requestLoadError = 'none';

    const datePlusOne = new Date(this.range.controls.end.value);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    this.requestService.getAllRequestsInternal(this.showAll, this.range.controls.start.value, datePlusOne).subscribe(
      (res) => {
        this.allRequests = this.sortRequestsByDataAndDate(res);
        this.dataSource = new MatTableDataSource<MiniRequest>(this.allRequests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setSortData();
        this.setFilterPredicate();
        this.resetAllFilters();
        this.sessionStorageService.storeRequests(this.allRequests);
        this.finding = false;
        this.agendoStatus = 'online';
        this.requestLoadError = 'none';
      },
      (err) => {
        this.allRequests = [];
        this.dataSource = new MatTableDataSource<MiniRequest>([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setFilterPredicate();
        this.finding = false;
        this.setRequestLoadError(err);
        console.error(err);
      }
    );
  }

  private getAllRequestsExternal(): void {
    this.finding = true;
    this.agendoStatus = 'checking';
    this.requestLoadError = 'none';

    this.requestService.getAllRequestsExternal().subscribe(
      (res) => {
        this.allRequests = res;
        this.dataSource = new MatTableDataSource<MiniRequest>(this.allRequests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setFilterPredicate();
        this.resetAllFilters();
        this.finding = false;
        this.agendoStatus = 'online';
        this.requestLoadError = 'none';
        this.setSortData();
      },
      (err) => {
        this.allRequests = [];
        this.dataSource = new MatTableDataSource<MiniRequest>([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setFilterPredicate();
        this.finding = false;
        this.setRequestLoadError(err);
        console.error(err);
      }
    );
  }

  private setRequestLoadError(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401 || err.status === 403) {
        this.requestLoadError = 'auth';
        this.agendoStatus = 'idle';
        return;
      }

      if (err.status === 0 || err.status >= 502) {
        this.requestLoadError = 'agendo';
        this.agendoStatus = 'offline';
        return;
      }
    }

    this.requestLoadError = 'generic';
    this.agendoStatus = 'idle';
  }

  private sortRequestsByDataAndDate(requests: MiniRequest[]): MiniRequest[] {
    return requests.sort((a, b) => {
      if (a.hasData !== b.hasData) {
        return a.hasData ? -1 : 1;
      }

      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();

      return dateB - dateA;
    });
  }

  public getAllCheckBoxChange(): void {
    if (this.allRequests && this.allRequests.length > 0) {
      this.getAllRequestsInternal();
    }
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(RequestListYearSelectorDialog, {
      width: '250px',
      data: {
        year: this.year,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.year = result;
        this.getAllRequests();
      }
    });
  }

  private setSortData(): void {
    if (!this.dataSource) {
      return;
    }

    this.dataSource.sortData = (data: MiniRequest[], sort) => {
      const direction = sort.direction === 'asc' ? 1 : -1;

      return data.sort((a, b) => {
        if (sort.active === 'hasData' || !sort.active || sort.direction === '') {
          if (a.hasData !== b.hasData) {
            return (a.hasData ? 1 : -1) * direction;
          }

          const dateA = new Date(a.creationDate).getTime();
          const dateB = new Date(b.creationDate).getTime();

          return dateB - dateA;
        }

        if (sort.active === 'creationDate') {
          const dateA = new Date(a.creationDate).getTime();
          const dateB = new Date(b.creationDate).getTime();

          return (dateA - dateB) * direction;
        }

        const valueA = sort.active === 'code' ? a.lastField : a[sort.active];
        const valueB = sort.active === 'code' ? b.lastField : b[sort.active];

        const textA = valueA ? valueA.toString().toLowerCase() : '';
        const textB = valueB ? valueB.toString().toLowerCase() : '';

        if (textA < textB) {
          return -1 * direction;
        }

        if (textA > textB) {
          return 1 * direction;
        }

        const dateA = new Date(a.creationDate).getTime();
        const dateB = new Date(b.creationDate).getTime();

        return dateB - dateA;
      });
    };
  }

  handleClick(row: MiniRequest): void {
    if (this.settingsMode) {
      this.router.navigate(['/settings/local/request', row.id]);
      return;
    }

    if (row.id) {
      this.router.navigate(['/request', row.id + '|' + row.lastField]);
    } else {
      this.router.navigate(['/request', row.lastField]);
    }
  }
}