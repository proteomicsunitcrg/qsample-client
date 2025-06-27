import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InstrumentService } from 'src/app/services/instrument.service';
import { MethodService } from 'src/app/services/method.service';
import { ApplicationService } from 'src/app/services/application.service';
import { QGeneratorService } from '../../../services/qGenerator.service';
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
    private methodService: MethodService,
    private qGeneratorService: QGeneratorService,
    private router: Router
  ) {}

  columnsToDisplay = ['name'];
  instrumentSource: MatTableDataSource<any>;
  applicationSource: MatTableDataSource<any>;
  methodSource: MatTableDataSource<any>;
  selectedApplicationIds: number[] = [];
  selectedInstrumentId: number | null = null;

  dataInstruments = new FormGroup({
    method: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    path: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
  });

  ngOnInit(): void {
    this.getAllInstruments();
    this.getAllApplications();
    this.getAllMethods();
  }

  private getAllInstruments(): void {
    this.instrumentService.getAll().subscribe(
      (res) => {
        this.instrumentSource = new MatTableDataSource(res);
        this.instrumentSource.data = this.instrumentSource.data.sort((a, b) => a.name.localeCompare(b.name));
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
        this.applicationSource.data = this.applicationSource.data.sort((a, b) => a.name.localeCompare(b.name));
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getAllMethods(): void {
    this.methodService.getAll().subscribe(
      (res) => {
        const filtered = res.filter((method) => method.name !== null);
        this.methodSource = new MatTableDataSource(filtered);
        this.methodSource.data = this.methodSource.data.sort((a, b) => a.name.localeCompare(b.name));
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Trigger by checkbox change
  public onApplicationCheckboxChange(appId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedApplicationIds.includes(appId)) {
        this.selectedApplicationIds = [...this.selectedApplicationIds, appId];
      }
    } else {
      this.selectedApplicationIds = this.selectedApplicationIds.filter((id) => id !== appId);
    }
  }

  // TODO: This needs to be changed and adapted
  public saveApplicationInstruments(): void {
    const selectedApplications = this.applicationSource.data.filter((app) =>
      this.selectedApplicationIds.includes(app.id)
    );
    console.log(selectedApplications);
  }

  public saveInstrumentPaths(): void {
    // TODO: To save only instrument paths depending on selection
    console.log('Save Instrument Paths');
  }

  public newSystem(): void {
    this.router.navigate(['/settings/QGenerator/systems/editor/', 'new']);
  }

  public selectInstrument(instrument: Instrument): void {
    this.selectedInstrumentId = instrument.id;
    this.dataInstruments.patchValue({ method: instrument.method, path: instrument.path });
    this.applicationService.getByInstrumentId(instrument.id).subscribe(
      (res) => {
        this.selectedApplicationIds = res.map((app) => app.id);
      },
      (err) => {
        console.error(err);
      }
    );
    this.qGeneratorService.getInjectionConditionsByInstrumentId(instrument).subscribe(
      (res) => {
        // TODO: Handle here what methods and QCs are available for the instrument
        console.log(res);
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
