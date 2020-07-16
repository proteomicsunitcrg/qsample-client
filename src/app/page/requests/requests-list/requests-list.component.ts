import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { RequestStatus } from '../../../models/RequestStatus';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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

  constructor(private requestService: RequestService, private router: Router) {
    this.getAllRequests();
    
  }

  requestStatusValues = RequestStatus;
  requestStatusValuesKeys() : Array<string> {
    var keys = Object.keys(this.requestStatusValues);
    return keys.slice(keys.length / 2);
  };

  caca = [
    {
      apiKey: "12",
      class: "Identification of a protein in a gel band",
      email: "Dio Brando",
      date_created: "2019-01-12",
      status: "In progress"
    },
    {
      apiKey: "13",
      class: "TMT: Proteome quantification",
        email: "Giorno Giovanna",
      date_created: "2019-03-23",
      status: "In progress"
    },
    {
      apiKey: "14",
      class: "Structural elucidation of crosslinked protein complexes",
      email: "Muhammad Avdol",
      date_created: "2020-01-23",
      status: "Completed"
    },
  ];
  columnsToDisplay = ['type', 'creatorMail', 'creationDate', 'status'];

  filteredValues = {};

  ngOnInit(): void {
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
    this.router.navigate(['/application/request/details', request.apiKey]);
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
  private getAllRequests(): void {
    this.requestService.getAllRequests().subscribe(
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

