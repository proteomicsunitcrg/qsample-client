import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Itemerino } from '../request-queue-generator.component';
@Component({
    selector: 'dialog-content-qgenerator-dialog',
    templateUrl: 'dialog-content-qgenerator-dialog.html',
})
export class QGeneratorDialogComponent {

    item: Itemerino;
    constructor(
        public dialogRef: MatDialogRef<QGeneratorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public itemC: any) {
        this.item = itemC.item;
    }

    public onYesClick(): void {
        this.dialogRef.close();
    }

}