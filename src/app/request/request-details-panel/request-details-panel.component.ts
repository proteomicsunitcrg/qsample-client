import { Component, Input, OnInit, OnChanges } from '@angular/core';
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

  local: boolean;

  ngOnInit(): void {
    setTimeout(() => {  // The timeout is necessary because the PLOT isnt instant

      if (this.request) {

        if (this.request.localCode !== null) { // means that a local code is setted so we dont have to use the agendo response and we avoid the "parser"
        // this.request.created_by.name = this.request.localCreator;

        this.local = true;

      } else {
        this.local = false;
      }

    } else {
      this.local = false;
    }
  }, 100)
}

  public openDialog(request: any): void {
    const dialogRef = this.dialog.open(RequestPanelDialogComponent, {
      data: {
        item: request
      }
    });
  }

}
