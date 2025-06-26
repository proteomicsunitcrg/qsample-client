import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InstrumentService } from 'src/app/services/instrument.service';
import { ApplicationService } from 'src/app/services/application.service';
// import { QGeneratorService } from '../../../services/qGenerator.service';
import { Instrument } from '../../../models/Instrument';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-qgenerator-systems',
  templateUrl: './settings-qgenerator-systems.component.html',
  styleUrls: ['./settings-qgenerator-systems.component.css'],
})
export class SettingsQgeneratorSystemsComponent implements OnInit {
  constructor(
    private applicationService: ApplicationService,
    private instrumentService: InstrumentService,
    private router: Router
  ) {}

  columnsToDisplay = ['name'];
  instrumentSource: MatTableDataSource<any>;
  applicationSource: MatTableDataSource<any>;
  applicationInstrumentSource: MatTableDataSource<any>;

  dataInstruments = new FormGroup({
    method: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    path: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
  });

  ngOnInit(): void {
    this.getAllInstruments();
    this.getAllApplications();
  }

  private getAllInstruments(): void {
    this.instrumentService.getAll().subscribe(
      (res) => {
        this.instrumentSource = new MatTableDataSource(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }
  private getAllApplications(): void {
    this.applicationService.getAll().subscribe(
      (res) => {
        this.applicationSource = new MatTableDataSource(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public saveInstrumentPaths(): void {
    // TODO: To save only instrument paths depending on selection
    console.log('Save Instrument Paths');
  }

  public newSystem(): void {
    this.router.navigate(['/settings/QGenerator/systems/editor/', 'new']);
  }

  public selectInstrument(instrument: Instrument): void {
    console.log(instrument);
    this.dataInstruments.patchValue({ method: instrument.method, path: instrument.path });
    this.applicationService.getByInstrumentId(instrument.id).subscribe(
      (res) => {
        this.applicationInstrumentSource = new MatTableDataSource(res);
        console.log(this.applicationInstrumentSource);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public edit(system: Instrument): void {
    this.router.navigate(['/settings/QGenerator/systems/editor/', system.id]);
  }
}
