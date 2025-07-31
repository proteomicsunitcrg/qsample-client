import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Application } from '../../../../models/Application';
import { Instrument } from '../../../../models/Instrument';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QGeneratorService } from '../../../../services/qGenerator.service';
// import { InjectionCondition } from '../../../../models/InjectionCondition';
import { InjectionConditionQC } from '../../../../models/InjectionConditionQC';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Method } from '../../../../models/Method';
import { MethodService } from '../../../../services/method.service';
@Component({
  selector: 'app-dialog-content-injection-conditions',
  templateUrl: 'dialog-content-injection-conditions.html',
})
export class InjectionConditionsDialogComponent implements OnInit {
  allMethods: Method[] = [];
  injectionCondition = new InjectionConditionQC(null, null, null, null, null, null);
  application: Application;
  instrument: Instrument;
  isUpdate = false;
  methodsToDisplay: Method[] = [];

  injCondForm = new FormGroup({
    // TODO: To check
    // method: new FormControl(this.injectionCondition.methods, [Validators.required]),
    method: null,
    volume: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  constructor(
    public dialogRef: MatDialogRef<InjectionConditionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public itemC: any,
    private qGeneratorService: QGeneratorService,
    private snackBar: MatSnackBar,
    private methodService: MethodService
  ) {
    this.application = itemC.application;
    this.instrument = itemC.instrument;
  }

  ngOnInit() {
    this.getMethodsByInstrumentId();
  }

  public onYesClick(): void {
    this.dialogRef.close();
  }

  private getMethodsByInstrumentId(): void {
    // this.qGeneratorService.getMethodsByInstrumentId(this.instrument).subscribe((res) => {
    //   if (res !== null) {
    //     // console.log(res);
    //
    //     let injectionConditions = res;
    //     this.injectionCondition = injectionConditions.shift(); // TODO: CHECK
    //     // this.injCondForm.get('method').setValue(this.injectionCondition.method);
    //     this.injCondForm.get('volume').setValue(this.injectionCondition.volume);
    //     this.isUpdate = true;
    //   } else {
    //     // TODO: To check
    //     // this.injectionCondition.method = [];
    //   }
    //   this.getAllMethods();
    // });
  }

  private getAllMethods(): void {
    this.methodService.getAll().subscribe(
      (res) => {
        this.allMethods = res;
        // TODO: To recover
        // this.checkIfMethodSelected();
        // console.log(this.methodsToDisplay);
      },
      (err) => console.error(err)
    );
  }

  // TODO: To check
  public save(): void {
    //   this.injectionCondition.volume = this.injCondForm.get('volume').value;
    //   this.injectionCondition.application = this.application;
    //   this.injectionCondition.instrument = this.instrument;
    //   // console.log(this.injectionCondition);
    //   this.qGeneratorService.saveInjectionCondition(this.injectionCondition).subscribe(
    //     (res) => {
    //       this.openSnackBar('Injection condition saved', 'Close');
    //       this.dialogRef.close();
    //     },
    //     (err) => {
    //       this.openSnackBar('Error, contact the administrators', 'Close');
    //     }
    //   );
  }

  // TODO: To recover
  public delete(): void {
    //   this.qGeneratorService.deleteInjectionCondition(this.injectionCondition.id).subscribe(
    //     (res) => {
    //       if (res) {
    //         this.openSnackBar('Injection condition deleted', 'Close');
    //         this.dialogRef.close();
    //       } else {
    //         this.openSnackBar('Error, contact the administrators', 'Close');
    //       }
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   );
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // TODO: To recover
  // private checkIfMethodSelected(): void {
  //   this.methodsToDisplay = [];
  //   // console.log(this.injectionCondition);
  //
  //   if (this.injectionCondition.methods.length === 0) {
  //     this.methodsToDisplay = this.allMethods;
  //     return;
  //   }
  //
  //   for (const item of this.allMethods) {
  //     const index = this.injectionCondition.methods.findIndex((i) => i.id === item.id);
  //     if (index === -1) {
  //       this.methodsToDisplay.push(item);
  //     }
  //   }
  //   if (this.methodsToDisplay.length === 0) {
  //     this.injCondForm.get('method').disable();
  //   }
  // }
  //
  // public methodClick(method: Method): void {
  //   // console.log(method);
  //   this.injectionCondition.methods.push(method);
  //   this.checkIfMethodSelected();
  // }
  //
  // public removeFromMethodFromInjectionCondition(method: Method): void {
  //   const index = this.injectionCondition.methods.findIndex((i) => i.id === method.id);
  //   this.injectionCondition.methods.splice(index, 1);
  //   this.checkIfMethodSelected();
  // }
}
