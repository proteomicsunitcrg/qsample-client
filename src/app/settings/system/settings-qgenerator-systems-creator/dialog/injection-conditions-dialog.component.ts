import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Application } from '../../../../models/Application';
import { Instrument } from '../../../../models/Instrument';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QGeneratorService } from '../../../../services/qGenerator.service';
import { InjectionCondition } from '../../../../models/InjectionCondition';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dialog-content-injection-conditions',
  templateUrl: 'dialog-content-injection-conditions.html',
})
export class InjectionConditionsDialog {

  injectionCondition = new InjectionCondition(null, null, null, null, null);
  application: Application;
  instrument: Instrument;
  isUpdate = false;

  constructor(
    public dialogRef: MatDialogRef<InjectionConditionsDialog>,
    @Inject(MAT_DIALOG_DATA) public itemC: any, private qGeneratorService: QGeneratorService, private snackBar: MatSnackBar) {
    this.application = itemC.application;
    this.instrument = itemC.instrument;
    this.getMethodsByAppNameAndInstrumentId();
  }

  public onYesClick(): void {
    this.dialogRef.close();
  }

  injCondForm = new FormGroup({
    method: new FormControl('', [
      Validators.required,
    ]),
    volume: new FormControl('', [
      Validators.required,
      Validators.min(0)
    ]),
  });


  private getMethodsByAppNameAndInstrumentId(): void {
    this.qGeneratorService.getMethodsByAppNameAndInstrumentId(this.application.name, this.instrument).subscribe(
      res => {
        if (res !== null)  {
          this.injectionCondition = res;
          this.injCondForm.get('method').setValue(this.injectionCondition.method);
          this.injCondForm.get('volume').setValue(this.injectionCondition.volume);
          this.isUpdate = true;
        }
      }
    );
  }

  public save(): void {
      this.injectionCondition.method = this.injCondForm.get('method').value;
      this.injectionCondition.volume = this.injCondForm.get('volume').value;
      this.injectionCondition.application = this.application;
      this.injectionCondition.instrument = this.instrument;
      this.qGeneratorService.saveInjectionCondition(this.injectionCondition).subscribe(
        res => {
          this.openSnackBar('Injection condition saved', 'Close');
          this.dialogRef.close();
        },
        err => {
          this.openSnackBar('Error, contact the administrators', 'Close');
        }
      );
  }

  public delete(): void {
    this.qGeneratorService.deleteInjectionCondition(this.injectionCondition.id).subscribe(
      res => {
        if (res) {
          this.openSnackBar('Injection condition deleted', 'Close');
          this.dialogRef.close();
        } else {
          this.openSnackBar('Error, contact the administrators', 'Close');
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
