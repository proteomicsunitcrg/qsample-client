import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QCtype } from '../../../models/QCtype';
import { QCtypeService } from '../../../services/qctype.service';

@Component({
  selector: 'app-settings-qgenerator-qctypes-creator',
  templateUrl: './settings-qgenerator-qctypes-creator.component.html',
  styleUrls: ['./settings-qgenerator-qctypes-creator.component.css'],
})
export class SettingsQgeneratorQCtypesCreatorComponent implements OnInit {
  constructor(
    private activeRouter: ActivatedRoute,
    private qctypeService: QCtypeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  qctypeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  oldName: string;
  qctype = new QCtype(null, null, null);
  isEdit: boolean;

  ngOnInit(): void {
    this.activeRouter.params.subscribe(
      (params) => {
        if (params.id !== 'new') {
          this.getByid(params.id);
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public save(): void {
    this.qctype.name = this.qctypeForm.get('name').value;
    this.qctypeService.save(this.qctype).subscribe(
      (res) => {
        this.openSnackBar('QCtype saved', 'Close');
      },
      (err) => {
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    );
  }

  public delete(): void {
    this.qctypeService.delete(this.qctype).subscribe(
      (res) => {
        if (res) {
          this.openSnackBar('QCtype deleted', 'Close');
          this.goBack();
        } else {
          this.openSnackBar(
            'Not deleted. Remember to delete all injection conditions before deleting a qctype',
            'Close'
          );
        }
      },
      (err) => {
        console.error(err);
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    );
  }

  private getByid(id: number): void {
    this.qctypeService.getById(id).subscribe(
      (res) => {
        this.oldName = res.name;
        this.qctype = res;
        this.qctypeForm.get('name').setValue(this.qctype.name);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public goBack(): void {
    this.router.navigate(['/settings/QGenerator/qctypes']);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
