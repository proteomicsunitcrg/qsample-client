import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
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

  columnsToDisplay = ['code', 'type', 'creatorName', 'creationDate', 'status'];

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

  public getAllRequests(): void {
    if (this.isInternal) {
      this.getAllRequestsInternal();
    } else {
      this.getAllRequestsExternal();
    }
  }

  public navigateToRequestCode(requestCode: string): void {
    this.router.navigate(['/request', requestCode]);
  }

  public getAllRequestsInternal(): void {
    this.finding = true;
    this.agendoStatus = 'checking';

    const datePlusOne = new Date(this.range.controls.end.value);
    datePlusOne.setDate(datePlusOne.getDate() + 1);

    this.requestService.getAllRequestsInternal(this.showAll, this.range.controls.start.value, datePlusOne).subscribe(
      (res) => {
        this.allRequests = res;
        this.dataSource = new MatTableDataSource<MiniRequest>(this.allRequests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setFilterPredicate();
        this.resetAllFilters();
        this.sessionStorageService.storeRequests(this.allRequests);
        this.finding = false;
        this.agendoStatus = 'online';
      },
      (err) => {
        this.allRequests = [];
        this.dataSource = new MatTableDataSource<MiniRequest>([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setFilterPredicate();
        this.finding = false;
        this.agendoStatus = 'offline';
        console.error(err);
      }
    );
  }

  private getAllRequestsExternal(): void {
    this.finding = true;
    this.agendoStatus = 'checking';

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
      },
      (err) => {
        this.allRequests = [];
        this.dataSource = new MatTableDataSource<MiniRequest>([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setFilterPredicate();
        this.finding = false;
        this.agendoStatus = 'offline';
        console.error(err);
      }
    );
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