import { Component, OnInit } from '@angular/core';
import { MiniRequest } from '../../../app/models/MiniRequest';
import { RequestStatus } from '../../../app/models/RequestStatus';
import { FavoriteRequestService } from '../../../app/services/favoriteRequest.service';

import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-table',
  templateUrl: './favorite-table.component.html',
  styleUrls: ['./favorite-table.component.css']
})
export class FavoriteTableComponent implements OnInit {

  constructor(private favoriteRequestService: FavoriteRequestService, private router: Router) { }
  allRequests: MiniRequest[] = [];
  dataSource: MatTableDataSource<MiniRequest>;
  columnsToDisplay = ['code', 'type', 'creatorName', 'creationDate', 'status'];

  classFilter = '';

  statusFilter = '';

  creatorFilter = '';

  lastFieldFilter = '';

  requestStatusValues = RequestStatus;
  requestStatusValuesKeys(): Array<string> {
    const keys = Object.keys(this.requestStatusValues);
    return keys.slice(keys.length / 2);
  }


  ngOnInit(): void {
    this.favoriteRequestService.getFavoriteRequests().subscribe(
      res => {
        this.allRequests = res;
        // for (const request of this.allRequests) {
        //   if ( window['env']['local_requests'] ) {
        //     request.lastField = request.lastField;
        //   } else {
        //     request.lastField = this.getRequestCodeFromRequest(request.lastField);
        //   }
        // }
        this.dataSource = new MatTableDataSource(res);
        this.predicate();

      },
      err => {
        console.error(err);
      }
    );
  }

  // private getRequestCodeFromRequest(request: any): string {
  //   try {
  //     const cac = JSON.parse(request);
  //     return cac[0][0].value.split('|')[0];
  //   } catch (error) {
  //     return 'none';
  //   }
  // }

  public goTo(request): void {
    this.router.navigate(['/request', request.lastField])
  }

  private resetAllFilters(): any {
    this.classFilter = '';
    this.statusFilter = '';
    this.creatorFilter = '';
    this.lastFieldFilter = '';
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
        id: 'creatorName',
        value: this.creatorFilter
      },
      {
        id: 'lastField',
        value: this.lastFieldFilter
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
        id: 'creatorName',
        value: this.creatorFilter
      },
      {
        id: 'lastField',
        value: this.lastFieldFilter
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
        id: 'creatorName',
        value: filterValue
      },
      {
        id: 'lastField',
        value: this.lastFieldFilter
      }
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
  }


  applyFilterCode(filterValue: string) {
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
        id: 'creatorName',
        value: this.creatorFilter
      },
      {
        id: 'lastField',
        value: filterValue
      }
    );
    // console.log(tableFilters);
    this.dataSource.filter = JSON.stringify(tableFilters);
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



}
