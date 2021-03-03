import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Application } from '../../../../models/Application';
import { Instrument } from '../../../../models/Instrument';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QGeneratorService } from '../../../../services/qGenerator.service';
import { InjectionCondition } from '../../../../models/InjectionCondition';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Method } from '../../../../models/Method';
import { MethodService } from '../../../../services/method.service';
import { InjectionConditionQCService } from '../../../../services/injectionConditionsQC.service';
import { InjectionConditionQC } from '../../../../models/InjectionConditionQC';
@Component({
  selector: 'app-dialog-content-injection-conditions-qc',
  templateUrl: 'dialog-content-injection-conditions-qc.html',
})
export class InjectionConditionsQCDialogComponent implements OnInit {

  qcType: string;
  instrument: Instrument;

  isUpdate = false;

  injCondId = null;

  injCondForm = new FormGroup({
    method: new FormControl('', [
      Validators.required,
    ]),
    volume: new FormControl('', [
      Validators.required,
      Validators.min(0)
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<InjectionConditionsQCDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public itemC: any, private injCondQCService: InjectionConditionQCService,
    private snackBar: MatSnackBar, private methodService: MethodService) {
    this.qcType = itemC.qcType;
    this.instrument = itemC.instrument;
  }

  ngOnInit() {
    this.findInjectionConditionQCByQCTypeAndInstrument();
  }


  private findInjectionConditionQCByQCTypeAndInstrument(): void {
    this.injCondQCService.findInjectionConditionQCByQCTypeAndInstrument(this.instrument, this.qcType).subscribe(
      res => {
        if (res != null) {
          this.injCondForm.controls.method.setValue(res.method);
          this.injCondForm.controls.volume.setValue(res.volume);
          this.isUpdate = true;
          this.injCondId = res.id;
        }
      },
      err => {
        this.openSnackBar('Something went wrong, contact the administrator', 'Close');
        console.log(err);
      }
    );
  }

  public save(): void {
    const injCond = new InjectionConditionQC(this.injCondId, this.qcType, this.instrument,
      this.injCondForm.controls.method.value, this.injCondForm.controls.volume.value);
    this.injCondQCService.saveInjectionCondition(injCond).subscribe(
      res => {
        this.openSnackBar('Injection condition saved', 'Close');
      },
      err => {
        this.openSnackBar('Something went wrong, contact the administrator', 'Close');
        console.error(err);
      }
    );
  }

  public delete(): void {
    if (!this.isUpdate) {
      return;
    }
    this.injCondQCService.deleteInjectionConditionQC(this.injCondId).subscribe(
      res => {
        if (res) {
          this.openSnackBar('Injection condition deleted', 'Close');
        } else {
          this.openSnackBar('Something went wrong, contact the administrator', 'Close');
        }
      },
      err => {
        this.openSnackBar('Something went wrong, contact the administrator', 'Close');
        console.error(err);
      }
    );
  }

  public onYesClick(): void {
    this.dialogRef.close();
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }



}
