import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { RequestStatus } from '../../../models/RequestStatus';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  classFilter = "";

  statusFilter = "";

  creatorFilter= "";

  subscription: Subscription;

  isInternal: boolean;




  constructor(private requestService: RequestService, private router: Router, private authService: AuthService) {
    this.subscription = this.authService.getIsInternal().subscribe(res => this.isInternal = res);
  }

  requestStatusValues = RequestStatus;
  requestStatusValuesKeys() : Array<string> {
    var keys = Object.keys(this.requestStatusValues);
    return keys.slice(keys.length / 2);
  };
  columnsToDisplay = ['type', 'creatorMail', 'creationDate', 'status'];

  filteredValues = {};

  ngOnInit(): void {
    if (this.isInternal) {
      this.getAllRequestsInternal();
    } else {
      this.getAllRequestsExternal();
    }
  }

  applyFilterStatus(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'type',
      value: this.classFilter
    },
    {
      id: 'status',
      value: filterValue
    },
    {
      id: 'creatorMail',
      value: this.creatorFilter
    }
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
  }


  applyFilterClass(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'type',
      value: filterValue
    },
    {
      id: 'status',
      value: this.statusFilter
    },
    {
      id: 'creatorMail',
      value: this.creatorFilter
    }
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
  }

  applyFilterCreator(filterValue: string) {
    const tableFilters = [];
    tableFilters.push(
      {
      id: 'type',
      value: this.classFilter
    },
    {
      id: 'status',
      value: this.statusFilter
    },
    {
      id: 'creatorMail',
      value: filterValue
    }
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
  }



  public goTo(request): void {
    console.log(request);

    this.router.navigate(['/request', request.id]);
  }

  private predicate() {
    this.dataSource.filterPredicate =
      (data: any, filtersJson: string) => {

        const matchFilter = [];
        const filters = JSON.parse(filtersJson);
        filters.forEach(filter => {
          const val = data[filter.id] === null ? '' : data[filter.id];
          matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
        });
        return matchFilter.every(Boolean);
      };
  }

  /**
   *
   */
  private getAllRequestsInternal(): void {
    this.requestService.getAllRequestsInternal().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.predicate();
      },
      err => {
        console.error(err);
      }
    );
  }

  private getAllRequestsExternal(): void {
    this.requestService.getAllRequestsExternal().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.predicate();
      },
      err => {
        console.error(err);
      }
    );
  }

}

