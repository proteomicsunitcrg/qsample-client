import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestPanelDialogComponent } from './dialog/request-panel-dialog.component';

@Component({
  selector: 'app-request-details-panel',
  templateUrl: './request-details-panel.component.html',
  styleUrls: ['./request-details-panel.component.css']
})
export class RequestDetailsPanelComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  // tslint:disable-next-line:no-input-rename
  @Input('request') request: any;

  ngOnInit(): void {
  }


  public openDialog(request: any): void {
    const dialogRef = this.dialog.open(RequestPanelDialogComponent, {
      data: {
        item: request
      }
    });
  }

}
