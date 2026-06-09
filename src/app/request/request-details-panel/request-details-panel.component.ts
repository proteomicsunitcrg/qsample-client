import { Component, Input, OnInit } from '@angular/core';
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

  public getFieldValue(fieldName: string): string {
    if (!this.request || !this.request.fields) {
      return '';
    }

    const field = this.request.fields.find((item: any) => item.name === fieldName);

    return field && field.value ? field.value : '';
  }
}
