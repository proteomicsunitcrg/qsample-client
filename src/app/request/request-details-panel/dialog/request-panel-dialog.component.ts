import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-content-request-panel',
  templateUrl: 'dialog-content-request-panel.html',
  styles: [`
    .request-dialog-empty {
      padding: 16px 0;
      color: rgba(0, 0, 0, 0.54);
      font-style: italic;
    }

    .request-dialog-field {
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    .request-dialog-field:last-child {
      border-bottom: none;
    }

    .request-dialog-field-important {
      padding: 12px;
      border-radius: 4px;
      background: rgba(63, 81, 181, 0.08);
    }

    .request-dialog-field-name {
      margin-bottom: 4px;
      font-weight: 600;
    }

    .request-dialog-field-value {
      white-space: pre-line;
      line-height: 1.4;
    }
  `],
})
export class RequestPanelDialogComponent {

  item: any;

  constructor(
    public dialogRef: MatDialogRef<RequestPanelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public itemC: any
  ) {
    this.item = itemC.item;
  }

  public getVisibleFields(): any[] {
    if (!this.item || !this.item.fields) {
      return [];
    }

    return this.item.fields.filter((field: any) => {
      return field && field.name && this.formatFieldValue(field.value);
    });
  }

  public formatFieldValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const valueText = String(value).trim();

    if (!valueText) {
      return '';
    }

    if (valueText === 'on') {
      return 'Yes';
    }

    return valueText;
  }

  public isImportantField(field: any): boolean {
    return false;
  }

  public onYesClick(): void {
    this.dialogRef.close();
  }

}
