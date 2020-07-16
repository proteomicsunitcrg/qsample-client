import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {

  dataSource: MatTableDataSource<any>;


  classFilter = "";

  statusFilter = "";

  creatorFilter= "";

  constructor(private requestService: RequestService, private router: Router) {
    this.getAllRequests();

  }
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
  columnsToDisplay = ['class', 'email', 'dateCreated', 'status'];

  filteredValues = {};

  ngOnInit(): void {


  }

  applyFilterStatus(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'class',
      value: this.classFilter
    },
    {
      id: 'status',
      value: filterValue
    },
    {
      id: 'email',
      value: this.creatorFilter
    }
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
    console.log(this.dataSource.filter)
  }


  applyFilterClass(filterValue: string) {
    console.log(this.creatorFilter);

    const tableFilters = [];
    tableFilters.push({
      id: 'class',
      value: filterValue
    },
    // {
    //   id: 'status',
    //   value: this.statusFilter
    // },
    // {
    //   id: 'email',
    //   value: this.creatorFilter
    // }
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
    console.log(this.dataSource.filter)
  }

  applyFilterCreator(filterValue: string) {
    const tableFilters = [];
    tableFilters.push(
      {
      id: 'class',
      value: this.classFilter
    },
    {
      id: 'status',
      value: this.statusFilter
    },
    {
      id: 'email',
      value: filterValue
    }
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
    console.log(this.dataSource.filter)
  }



  public goTo(request): void {
    console.log(request);
    this.router.navigate(['/application/request/details', request.apiKey]);
  }

  private predicate() {
    this.dataSource.filterPredicate =
      (data: any, filtersJson: string) => {

        const matchFilter = [];
        const filters = JSON.parse(filtersJson);
        filters.forEach(filter => {
          console.log(filter.id);

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
        this.dataSource = new MatTableDataSource(res.request);
        this.predicate();
      },
      err => {
        console.error(err);
      }
    );
  }

}

