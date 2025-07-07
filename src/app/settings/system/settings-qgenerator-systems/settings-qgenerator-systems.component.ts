import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InstrumentService } from 'src/app/services/instrument.service';
import { MethodService } from 'src/app/services/method.service';
import { InjectionConditionQCService } from 'src/app/services/injectionConditionsQC.service';
import { ApplicationService } from 'src/app/services/application.service';
import { QCtypeService } from 'src/app/services/qctype.service';
import { QGeneratorService } from '../../../services/qGenerator.service';
import { Instrument } from '../../../models/Instrument';
import { Method } from '../../../models/Method';
import { QCtype } from '../../../models/QCtype';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

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
    private qctypeService: QCtypeService,
    private qGeneratorService: QGeneratorService,
    private injectionConditionQCService: InjectionConditionQCService,
    private router: Router
  ) {}
  @ViewChild('methodsPanel') methodsPanel: MatExpansionPanel;
  @ViewChild('qctypesPanel') qctypesPanel: MatExpansionPanel;
  @ViewChild('volumesPanel') volumesPanel: MatExpansionPanel;

  columnsToDisplay = ['name'];
  instrumentSource: MatTableDataSource<any>;
  applicationSource: MatTableDataSource<any>;
  methodSource: MatTableDataSource<any>;
  qctypeSource: MatTableDataSource<any>;
  volumes: number[] = [];
  selectedApplicationIds: number[] = [];
  selectedMethodIds: number[] = [];
  selectedQCtypeIds: number[] = [];
  selectedVolumes: number[] = [];
  selectedInstrumentId: number | null = null;
  selectedInstrument: Instrument | null = null;
  selectedMethod: Method | null = null;
  isVolumeInputEnabled = false;
  editMode = false;

  selectedMethodId: number | null = null;
  selectedQCtypeId: number | null = null;
  selectedVolume: number | null = null;

  selectedMethodBox: Method | null = null;
  selectedQCtypeBox: QCtype | null = null;

  dataInstruments = new FormGroup({
    method: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    path: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(60)]),
  });

  volumeControl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]);

  ngOnInit(): void {
    this.getAllInstruments();
    this.getAllApplications();
    this.getAllMethods();
    this.getAllQCtypes();
  }

  // TODO: Handle editMode -> Only allow one checkbox checked per panel

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
  private getAllQCtypes(): void {
    this.qctypeService.getAll().subscribe(
      (res) => {
        this.qctypeSource = new MatTableDataSource(res);
        this.qctypeSource.data = this.qctypeSource.data.sort((a, b) => a.name.localeCompare(b.name));
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getInjectionConditionsQCByInstrument(): void {
    this.injectionConditionQCService.findByInstrumentId(this.selectedInstrument).subscribe(
      (res) => {
        const filtered = res.filter((iqc) => iqc.method !== null);

        const uniqueVolumes = [...new Set(filtered.map((iqc) => iqc.volume))];
        const uniqueQCtypes = [...new Set(filtered.filter((iqc) => iqc.qctype !== null).map((iqc) => iqc.qctype))];
        // this.qctypeSource = new MatTableDataSource(uniqueQCtypes);
        // this.qctypeSource.data = this.qctypeSource.data.sort((a, b) => a.name.localeCompare(b.name));
        this.volumes = uniqueVolumes.sort((a, b) => a - b);

        this.selectedMethodIds = filtered.map((iqc) => iqc.method.id);
        if (this.selectedMethod) {
          this.selectedQCtypeIds = filtered
            .filter((iqc) => iqc.method.id == this.selectedMethod.id && iqc.qctype !== null)
            .map((iqc) => iqc.qctype.id);
          this.selectedVolumes = filtered
            .filter((iqc) => iqc.method.id == this.selectedMethod.id && iqc.volume !== null)
            .map((iqc) => iqc.volume);

          if (this.qctypesPanel) {
            if (this.selectedQCtypeIds.length > 0) {
              this.qctypesPanel.open();
            } else {
              this.qctypesPanel.close();
            }
          }
          if (this.volumesPanel) {
            if (this.selectedVolumes.length > 0) {
              this.volumesPanel.open();
            } else {
              this.volumesPanel.close();
            }
          }
        }
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

  onMethodCheckboxChange(method: Method, checked: boolean): void {
    this.selectedMethodBox = checked ? method : null;
  }

  onQCtypeCheckboxChange(qctype: QCtype, checked: boolean): void {
    this.selectedQCtypeBox = checked ? qctype : null;
  }

  onVolumeCheckboxChange(id: number, checked: boolean): void {
    this.selectedVolume = checked ? id : null;
  }

  // TODO: This needs to be changed and adapted
  public saveApplicationInstruments(): void {
    const selectedApplications = this.applicationSource.data.filter((app) =>
      this.selectedApplicationIds.includes(app.id)
    );
  }

  public saveInstrumentPaths(): void {
    // TODO: To save only instrument paths depending on selection
    console.log('Save Instrument Paths');
  }

  // This exposes an input to put a different number
  public newVolume(): void {
    this.isVolumeInputEnabled = true;
    this.volumeControl.enable();
    this.selectedVolume = null;
  }

  public onVolumeInputEnter(): void {
    if (this.volumeControl.valid) {
      this.selectedVolume = this.volumeControl.value;
      // Optionally disable input or reset:
      // this.isVolumeInputEnabled = false;
      // this.volumeControl.reset();
    }
  }

  public newSystem(): void {
    this.router.navigate(['/settings/QGenerator/systems/editor/', 'new']);
  }

  public goToApplications(): void {
    this.router.navigate(['/settings/QGenerator/applications']);
  }
  public goToApplicationsNew(): void {
    this.router.navigate(['/settings/QGenerator/applications/editor/', 'new']);
  }

  public goToMethods(): void {
    this.router.navigate(['/settings/QGenerator/methods']);
  }
  public goToMethodsNew(): void {
    this.router.navigate(['/settings/QGenerator/methods/editor/', 'new']);
  }

  public goToQCtypes(): void {
    this.router.navigate(['/settings/QGenerator/qctypes']);
  }
  public goToQCtypesNew(): void {
    this.router.navigate(['/settings/QGenerator/qctypes/editor/', 'new']);
  }

  // Trigger a new Injection Condition QC
  public commitInjectionConditionQC(): void {
    console.log(this.selectedInstrument, this.selectedMethodBox, this.selectedQCtypeBox, this.selectedVolume);
    if (this.editMode && this.selectedInstrument && this.selectedMethodBox) {
      if (this.selectedQCtypeBox) {
        console.log('QC Type selected:', this.selectedQCtypeBox);
      }

      if (this.selectedVolume === null) {
        alert('Volume needed');
      } else {
        const newInjectionConditionQC = {
          instrument: this.selectedInstrument,
          method: this.selectedMethodBox,
          qctype: this.selectedQCtypeBox,
          volume: this.selectedVolume,
        };

        console.log('New Injection Condition QC:', newInjectionConditionQC);
        alert(`New Injection Condition QC: ${JSON.stringify(newInjectionConditionQC)}`);

        // TODO: Prevent to save if condition already exists! -> Check from preloaded

        // this.injectionConditionQCService.create(newInjectionConditionQC).subscribe(
        //   (res) => {
        //     console.log('New Injection Condition QC created:', res);
        //     this.getInjectionConditionsQCByInstrument();
        //     // Reset selections
        //     this.selectedMethodId = null;
        //     this.selectedQCtypeId = null;
        //     this.selectedVolume = null;
        //     this.volumeControl.reset();
        //     this.isVolumeInputEnabled = false;
        //   },
        //   (err) => {
        //     console.error('Error creating Injection Condition QC:', err);
        //   }
        // );
      }
    }
  }

  public selectInstrument(instrument: Instrument): void {
    this.selectedInstrument = instrument;
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

    this.getInjectionConditionsQCByInstrument();
    if (this.methodsPanel) {
      this.methodsPanel.open();
    }
    //     // if (this.volumesPanel) {
    //   this.volumesPanel.open();
    // }
  }
  public selectMethod(method: Method): void {
    if (this.selectedMethodIds.includes(method.id)) {
      this.selectedMethod = method;
      this.getInjectionConditionsQCByInstrument();
    }
  }

  public edit(system: Instrument): void {
    this.router.navigate(['/settings/QGenerator/systems/editor/', system.id]);
  }
}
