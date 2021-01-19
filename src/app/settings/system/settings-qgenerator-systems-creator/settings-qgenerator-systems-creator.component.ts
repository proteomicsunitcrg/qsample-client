import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InstrumentService } from '../../../services/instrument.service';
import { Instrument } from '../../../models/Instrument';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { InjectionConditionsDialogComponent } from './dialog/injection-conditions-dialog.component';
import { Application } from '../../../models/Application';


@Component({
  selector: 'app-settings-qgenerator-systems-creator',
  templateUrl: './settings-qgenerator-systems-creator.component.html',
  styleUrls: ['./settings-qgenerator-systems-creator.component.css']
})
export class SettingsQgeneratorSystemsCreatorComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private instrumentService: InstrumentService, private snackBar: MatSnackBar,
              private router: Router, private applicationService: ApplicationService, private dialog: MatDialog) {

  }

  systemFrom = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
  });

  columnsToDisplay = ['name'];
  dataSource: MatTableDataSource<any>;

  dataSourceQC: MatTableDataSource<any>;


  oldName: string;
  instrument = new Instrument(null, null);
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
    this.getAllApplications();
    this.getAllQC();
  }

  private getByid(id: number): void {
    this.instrumentService.getById(id).subscribe(
      res => {
        this.oldName = res.name;
        this.instrument = res;
        this.systemFrom.get('name').setValue(this.instrument.name);
      },
      err => {
        console.log(err);
      }
    );
  }

  public save(): void {
    this.instrument.name = this.systemFrom.get('name').value;
    this.instrumentService.save(this.instrument).subscribe(
      res => {
        this.openSnackBar('Instrument saved', 'Close');
        this.goBack();
      },
      err => {
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    );
  }

  public delete(): void {
    this.instrumentService.delete(this.instrument).subscribe(
      res => {
        if (res) {
          this.openSnackBar('Instrument deleted', 'Close');
          this.goBack();
        } else {
          this.openSnackBar('Remove all injection conditions before the deletion', 'Close');
        }
      },
      err => {
        console.log(err);
        this.openSnackBar('Error, contact the administrators', 'Close');
      }
    );
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public goBack(): void {
    this.router.navigate(['/settings/QGenerator/systems']);
  }

  private getAllApplications(): void {
    this.applicationService.getAll().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  private getAllQC(): void {
    const allQC = ['QC01', 'QC02', 'QC03', 'QBSA', 'QHELA'];
    this.dataSourceQC = new MatTableDataSource(allQC);
  }


  public openDialog(application: Application, instrument: Instrument): void {
    const dialogRef = this.dialog.open(InjectionConditionsDialogComponent, {
      data: {
        application,
        instrument
      },
      width: '75%',
    });
  }


}


