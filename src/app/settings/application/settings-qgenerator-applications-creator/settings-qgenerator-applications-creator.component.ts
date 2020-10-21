import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { InstrumentService } from 'src/app/services/instrument.service';
import { Application } from '../../../models/Application';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-settings-qgenerator-applications-creator',
  templateUrl: './settings-qgenerator-applications-creator.component.html',
  styleUrls: ['./settings-qgenerator-applications-creator.component.css']
})
export class SettingsQgeneratorApplicationsCreatorComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private applicationService: ApplicationService, private snackBar: MatSnackBar, private router: Router) { }

  systemFrom = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
  });

  oldName: string;
  application = new Application(null, null);
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
    this.application.name = this.systemFrom.get('name').value;
    this.applicationService.save(this.application).subscribe(
      res => {
        this.openSnackBar('Instrument saved', 'Close');
      },
      err => {
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    );
  }

  public delete(): void {
    this.applicationService.delete(this.application).subscribe(
      res => {
        if (res) {
          this.openSnackBar('Instrument deleted', 'Close');
          this.goBack();
        } else {
          this.openSnackBar('Not deleted. Remember to delete all injection conditions before deleting an application', 'Close');
        }
      },
      err => {
        console.log(err);
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    )
  }


  private getByid(id: number): void {
    this.applicationService.getById(id).subscribe(
      res => {
        this.oldName = res.name;
        this.application = res;
        this.systemFrom.get('name').setValue(this.application.name);
      },
      err => {
        console.log(err);
      }
    );
  }

  public goBack(): void {
    this.router.navigate(['/settings/QGenerator/applications']);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
