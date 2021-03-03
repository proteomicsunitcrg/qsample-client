import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QCloud2File } from '../../../models/QCloud2File';
@Component({
  selector: 'app-dialog-non-conformities-conditions',
  templateUrl: 'dialog-content-non-conformities.html',
  styleUrls: ['./dialog-content-non-conformities.css']

})
export class NonConformitiesDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NonConformitiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public itemC: any) {
    this.ncFiles = itemC.files;
    console.log(this.ncFiles);

  }

  ncFiles: QCloud2File[];



  public goToQCloud2(file: QCloud2File): void {
    const win = window.open(`https://qcloud2.crg.eu/application/view/instrument/${file.lsApiKey}?checksum=${file.checksum}`, '_blank');
    win.focus();
  }


}
