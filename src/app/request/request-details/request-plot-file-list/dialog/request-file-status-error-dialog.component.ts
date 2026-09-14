import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestFileStatus } from '../../../../models/RequestFileStatus';

const REASON_PREVIEW_LENGTH = 300;

@Component({
  selector: 'app-request-file-status-error-dialog',
  templateUrl: 'dialog-content-error.html',
  styleUrls: ['./dialog-content-error.css']
})
export class RequestFileStatusErrorDialogComponent {

  filename: string;
  status: RequestFileStatus;
  showFullReason = false;

  constructor(
    public dialogRef: MatDialogRef<RequestFileStatusErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { filename: string; status: RequestFileStatus }) {
    this.filename = data.filename;
    this.status = data.status;
  }

  get reasonIsTruncated(): boolean {
    return (this.status.errorReason?.length ?? 0) > REASON_PREVIEW_LENGTH;
  }

  get displayedReason(): string {
    const reason = this.status.errorReason ?? '';
    if (this.showFullReason || !this.reasonIsTruncated) {
      return reason;
    }
    return reason.substring(0, REASON_PREVIEW_LENGTH) + '…';
  }

}
