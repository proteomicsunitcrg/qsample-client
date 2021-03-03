import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-content-request-panel',
  templateUrl: 'dialog-content-request-panel.html',
})
export class RequestPanelDialogComponent {

  item: any;
  constructor(
    public dialogRef: MatDialogRef<RequestPanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public itemC: any) {
    this.item = itemC.item;
    console.log(this.item);

  }

  public onYesClick(): void {
    this.dialogRef.close();
  }

}
