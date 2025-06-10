import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Instrument } from '../../../models/Instrument';
import { ApplicationService } from '../../../services/application.service';
import { InstrumentService } from '../../../services/instrument.service';
import { InjectionConditionsQCDialogComponent } from './dialog/injection-conditions-dialog-qc.component';

@Component({
  selector: 'app-settings-qgenerator-systems-qc',
  templateUrl: './settings-qgenerator-systems-qc.component.html',
  styleUrls: ['./settings-qgenerator-systems-qc.component.css'],
})
export class SettingsQgeneratorSystemsQcComponent implements OnInit {
  constructor(
    private activeRouter: ActivatedRoute,
    private instrumentService: InstrumentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private applicationService: ApplicationService,
    private dialog: MatDialog
  ) {}

  instrument = new Instrument(null, null, null, null);

  allQCTypes = ['QBSA', 'QC01', 'QC02', 'QHELA', 'QC03'];

  columnsToDisplay = ['name'];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.activeRouter.params.subscribe(
      (params) => {
        this.getByid(params.id);
      },
      (err) => {
        console.error(err);
      }
    );
    this.dataSource = new MatTableDataSource(this.allQCTypes);
  }

  private getByid(id: number): void {
    this.instrumentService.getById(id).subscribe(
      (res) => {
        this.instrument = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public openDialog(qcType: string): void {
    const dialogRef = this.dialog.open(InjectionConditionsQCDialogComponent, {
      data: {
        qcType,
        instrument: this.instrument,
      },
      width: '75%',
    });
  }
}
