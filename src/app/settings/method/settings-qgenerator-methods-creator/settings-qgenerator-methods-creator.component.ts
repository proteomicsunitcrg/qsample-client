import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Method } from '../../../models/Method';
import { MethodService } from '../../../services/method.service';

@Component({
  selector: 'app-settings-qgenerator-methods-creator',
  templateUrl: './settings-qgenerator-methods-creator.component.html',
  styleUrls: ['./settings-qgenerator-methods-creator.component.css']
})
export class SettingsQgeneratorMethodsCreatorComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private methodService: MethodService,
    private snackBar: MatSnackBar, private router: Router) { }

  methodForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
  });

  oldName: string;
  method = new Method(null, null);
  isEdit: boolean;

  ngOnInit(): void {
    this.activeRouter.params.subscribe(
      params => {
        if (params.id !== 'new') {
          this.getByid(params.id);
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  public save(): void {
    this.method.name = this.methodForm.get('name').value;
    this.methodService.save(this.method).subscribe(
      res => {
        this.openSnackBar('Method saved', 'Close');
      },
      err => {
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    );
  }

  public delete(): void {
    this.methodService.delete(this.method).subscribe(
      res => {
        if (res) {
          this.openSnackBar('Method deleted', 'Close');
          this.goBack();
        } else {
          this.openSnackBar('Not deleted. Remember to delete all injection conditions before deleting a method', 'Close');
        }
      },
      err => {
        console.log(err);
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    );
  }


  private getByid(id: number): void {
    this.methodService.getById(id).subscribe(
      res => {
        this.oldName = res.name;
        this.method = res;
        this.methodForm.get('name').setValue(this.method.name);
      },
      err => {
        console.log(err);
      }
    );
  }

  public goBack(): void {
    this.router.navigate(['/settings/QGenerator/methods']);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
