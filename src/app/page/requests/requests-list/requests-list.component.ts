import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { RequestService } from "../../../services/request.service";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup } from "@angular/forms";
import { RequestStatus } from "../../../models/RequestStatus";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AuthService } from "../../../services/auth.service";
import { Subscription } from "rxjs";
import { MiniRequest } from "../../../models/MiniRequest";
import { MatDialog } from "@angular/material/dialog";
import { RequestListYearSelectorDialog } from "./dialog/request-list-year-selector-dialog";

@Component({
  selector: "app-requests-list",
  templateUrl: "./requests-list.component.html",
  styleUrls: ["./requests-list.component.css"],
})
export class RequestsListComponent implements OnInit {
  dataSource: MatTableDataSource<MiniRequest>;

  allRequests: MiniRequest[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  classFilter = "";

  statusFilter = "";

  creatorFilter = "";

  lastFieldFilter = "";

  subscription: Subscription;

  isInternal: boolean;

  // columnsToDisplay = ['code', 'type', 'creatorName', 'creationDate', 'status', 'hasData'];

  columnsToDisplay = ["code", "type", "creatorName", "creationDate", "status"];

  filteredValues = {};

  showAll = true;

  today = new Date();

  monthAgo = new Date(new Date().setMonth(this.today.getMonth() - 6));

  finding = false;

  range = new FormGroup({
    start: new FormControl(this.monthAgo),
    end: new FormControl(this.today),
  });

  year: number;

  @Input("settingsMode") settingsMode: boolean;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.subscription = this.authService
      .getIsInternal()
      .subscribe((res) => (this.isInternal = res));
  }

  requestStatusValues = RequestStatus;
  requestStatusValuesKeys(): Array<string> {
    const keys = Object.keys(this.requestStatusValues);
    return keys.slice(keys.length / 2);
  }

  ngOnInit(): void {
    this.getAllRequests();
  }

  private resetAllFilters(): any {
    this.classFilter = "";
    this.statusFilter = "";
    this.creatorFilter = "";
    this.lastFieldFilter = "";
  }

  applyFilterStatus(filterValue: string) {
    const tableFilters = [];
    tableFilters.push(
      {
        id: "type",
        value: this.classFilter,
      },
      {
        id: "status",
        value: filterValue,
      },
      {
        id: "creatorName",
        value: this.creatorFilter,
      },
      {
        id: "lastField",
        value: this.lastFieldFilter,
      },
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
  }

  applyFilterClass(filterValue: string) {
    const tableFilters = [];
    tableFilters.push(
      {
        id: "type",
        value: filterValue,
      },
      {
        id: "status",
        value: this.statusFilter,
      },
      {
        id: "creatorName",
        value: this.creatorFilter,
      },
      {
        id: "lastField",
        value: this.lastFieldFilter,
      },
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
  }

  applyFilterCreator(filterValue: string) {
    const tableFilters = [];
    tableFilters.push(
      {
        id: "type",
        value: this.classFilter,
      },
      {
        id: "status",
        value: this.statusFilter,
      },
      {
        id: "creatorName",
        value: filterValue,
      },
      {
        id: "lastField",
        value: this.lastFieldFilter,
      },
    );
    this.dataSource.filter = JSON.stringify(tableFilters);
  }

  applyFilterCode(filterValue: string) {
    const tableFilters = [];
    tableFilters.push(
      {
        id: "type",
        value: this.classFilter,
      },
      {
        id: "status",
        value: this.statusFilter,
      },
      {
        id: "creatorName",
        value: this.creatorFilter,
      },
      {
        id: "lastField",
        value: filterValue,
      },
    );
    // console.log(tableFilters);
    this.dataSource.filter = JSON.stringify(tableFilters);
  }

  private goTo(request): void {
    this.router.navigate(["/request", request.lastField]);
  }

  private goToRequestEditor(request): void {
    this.router.navigate(["/settings/local/request/editor", request.lastField]);
  }

  public handleClick(request): void {
    if (!this.settingsMode) {
      this.goTo(request);
    } else {
      this.goToRequestEditor(request);
    }
  }

  private predicate() {
    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);
      filters.forEach((filter) => {
        const val = data[filter.id] === null ? "" : data[filter.id];
        matchFilter.push(
          val.toLowerCase().includes(filter.value.toLowerCase()),
        );
      });
      return matchFilter.every(Boolean);
    };
  }

  public getAllRequests(): void {
    this.resetAllFilters();
    if (this.isInternal) {
      this.getAllRequestsInternal();
    } else {
      this.getAllRequestsExternal();
    }
  }

  /**
   *
   */
  public getAllRequestsInternal(): void {
    const datePlusOne = new Date(
      this.range.controls.end.value.getTime() + 1000 * 60 * 60 * 24,
    );
    this.finding = true;
    this.requestService
      .getAllRequestsInternal(
        this.showAll,
        this.range.controls.start.value,
        datePlusOne,
      )
      .subscribe(
        (res) => {
          this.finding = false;
          this.allRequests = res;
          // Commented since lastField is already clean
          // for (const request of this.allRequests) {
          //   if (!request.local) {
          //     request.lastField = this.getRequestCodeFromRequest(request.lastField);
          //   }
          // }

          this.storeRequestsInSessionStorage(this.allRequests);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.predicate();
        },
        (err) => {
          console.error(err);
        },
      );
  }

  // TODO: sessionStorage here: https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks
  private storeRequestsInSessionStorage(requests: MiniRequest[]): void {
    // TODO: Map request by request code
    // TODO: Place requests in sessionStorage
  }

  // private getRequestCodeFromRequest(request: any): string {
  //   try {
  //     const cac = JSON.parse(request);
  //     return cac[0][0].value.split('|')[0];
  //   } catch (error) {
  //     return 'none';
  //   }
  // }

  private getAllRequestsExternal(): void {
    this.requestService.getAllRequestsExternal().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.predicate();
      },
      (err) => {
        console.error(err);
      },
    );
  }

  public getAllCheckBoxChange(): void {
    this.getAllRequestsInternal();
    this.resetAllFilters();
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(RequestListYearSelectorDialog, {
      data: {},
      width: "35%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.year = result;
        this.setYear(result);
      }
    });
  }

  private setYear(year: number) {
    const starDate = new Date(new Date().setFullYear(year, 0, 1));
    const endDate = new Date(new Date().setFullYear(year, 11, 31));
    this.range.controls.start.setValue(starDate);
    this.range.controls.end.setValue(endDate);
    this.getAllRequests();
  }
}
