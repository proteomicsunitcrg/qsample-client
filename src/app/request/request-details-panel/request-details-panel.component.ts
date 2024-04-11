import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestPanelDialogComponent } from './dialog/request-panel-dialog.component';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-request-details-panel',
  templateUrl: './request-details-panel.component.html',
  styleUrls: ['./request-details-panel.component.css'],
})
export class RequestDetailsPanelComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private requestService: RequestService
  ) {}

  // tslint:disable-next-line:no-input-rename
  @Input('request') request: any;

  isLocalMode = false;

  ngOnInit(): void {
    this.requestService.getIsLocalModeEnabled().subscribe(
      (res) => {
        this.isLocalMode = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public openDialog(request: any): void {
    const dialogRef = this.dialog.open(RequestPanelDialogComponent, {
      data: {
        item: request,
      },
    });
  }
}
