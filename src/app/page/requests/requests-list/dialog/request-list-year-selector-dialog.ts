import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-request-list-year-selector-dialog',
  templateUrl: 'app-request-list-year-selector-dialog.html',
  styleUrls: ['./app-request-list-year-selector-dialog.css']

})
export class RequestListYearSelectorDialog {

  constructor(
    public dialogRef: MatDialogRef<RequestListYearSelectorDialog>,
    @Inject(MAT_DIALOG_DATA) public itemC: any) {
  }
}
