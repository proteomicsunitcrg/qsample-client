import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { QGeneratorService } from '../../services/qGenerator.service';
import { Instrument } from '../../models/Instrument';
import { InjectionCondition } from '../../models/InjectionCondition';
import { MatDialog } from '@angular/material/dialog';
import { QGeneratorDialogComponent } from './dialog/QGeneratorDialog.component';
import { saveAs } from 'file-saver';
import { Method } from '../../models/Method';
import { InjectionConditionQCService } from '../../services/injectionConditionsQC.service';
import { InjectionConditionQC } from '../../models/InjectionConditionQC';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-queue-generator',
  templateUrl: './request-queue-generator.component.html',
  styleUrls: ['./request-queue-generator.component.css'],
})
export class RequestQueueGeneratorComponent implements OnInit, OnDestroy {
  isLocal = false;

  constructor(
    private activeRouter: ActivatedRoute,
    private requestService: RequestService,
    private router: Router,
    private qGeneratorService: QGeneratorService,
    public dialog: MatDialog,
    private injectionConditionQCService: InjectionConditionQCService,
    private snackBar: MatSnackBar
  ) {
    this.activeRouter.params.subscribe((params) => {
      // if apiKey has a | then we split it and get the first element
      // TODO: Replace this with sessionStorage handling
      if (params.apiKey.includes('|')) {
        this.requestCode = params.apiKey.split('|')[0];
        this.requestId = parseInt(params.apiKey.split('|')[1], 10);
      } else {
        this.requestCode = params.apiKey;
      }

      // Here we get samples from Angendo using requestId
      if (this.requestId) {
        this.requestService.getRequestDetails(this.requestId).subscribe(
          (res) => {
            if (res) {
              if (res.localCode) {
                this.isLocal = true;
              }
              this.request = res;
              // this.requestCode = this.getRequestCodeFromRequest(this.request);
              this.getSamplesFromRequests(this.request);
              this.taxonomyCode = this.getTaxonomyCodeFromName(this.getTaxonomyFromRequest());
              this.databaseCode = this.getDatabaseFromRequest();
              this.requestService.changeRequestCode(this.requestCode);
              this.getAvailableInstruments();
            }
          },
          (err) => {
            console.error(err);
          }
        );
      } else {
        alert('No sample retrieval service associated');
      }
    });
  }
  @ViewChild('table') table: MatTable<Itemerino>;
  displayedColumns: string[] = ['sampleType', 'filename', 'method', 'position', 'volume', 'edit', 'delete', 'add'];

  taxonomyCode: number;

  request: any;

  requestId: number;

  requestCode: string;

  samples: Itemerino[] = [];

  year = new Date().getFullYear();

  month = ('0' + (new Date().getMonth() + 1)).slice(-2);

  day = ('0' + new Date().getDate()).slice(-2);

  dataSource: Itemerino[] = [];

  cloneGlobal: Itemerino[] = [];

  clientCode: string;

  availableInstruments: Instrument[] = [];

  selectedInstrument: Instrument;

  selectedMethod: Method;

  injectionCondition: InjectionCondition;

  injectionConditionsQC: InjectionConditionQC[];

  path = 'C:\\Xcalibur\\Data';

  methodPath = 'C:\\Xcalibur\\methods\\current\\';

  databaseCode: string;

  qc1Counter = 1;

  qc2Counter = 1;

  qc3Counter = 1;

  qBSACounter = 1;

  qHELACounter = 1;

  csvSubscription: Subscription; // Subscription to the CSV uploaded by the user in the other component

  ngOnInit(): void {
    this.subscribeToSelectedPeptidesList();
  }

  ngOnDestroy(): void {
    this.csvSubscription.unsubscribe();
  }

  private getAvailableInstruments(): void {
    this.qGeneratorService.getAvailableInstruments(this.request.classs).subscribe(
      (res) => {
        this.availableInstruments = res;
        if (this.availableInstruments.length === 1) {
          this.selectedInstrument = this.availableInstruments[0];
          this.getMethodsByAppNameAndInstrumentId();
          this.getInstrumentInjectionConditionsQC();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getMethodsByAppNameAndInstrumentId(): void {
    this.qGeneratorService.getMethodsByAppNameAndInstrumentId(this.request.classs, this.selectedInstrument).subscribe(
      (res) => {
        this.injectionCondition = res;
        if (this.injectionCondition !== undefined) {
          this.applyInjectionConditions();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public applyInjectionConditions(): void {
    for (const item of this.dataSource) {
      if (item.sampleType === 'Unknown') {
        if (this.selectedMethod) {
          item.method = this.selectedMethod.name;
          item.volume = this.injectionCondition.volume;
        }
      } else {
        item.method = this.getMethodAndVolumeQC(this.selectedInstrument, item.qcType).method;
        item.volume = this.getMethodAndVolumeQC(this.selectedInstrument, item.qcType).volume;
      }
    }
  }

  private getRequestCodeFromRequest(request: any): string {
    if (this.isLocal) {
      return request.localCode;
    } else {
      return request.ref;
    }
  }

  private parseLocalSamples(samples: string): any {
    if (samples == '') {
      return;
    }
    return samples.split('---');
  }

  private generateClientCode(sampleName: string): string {
    return sampleName.split('_')[1];
  }

  private getSamplesFromRequests(request: any): void {
    let samples = [];
    if (this.isLocal) {
      samples = this.parseLocalSamples(request.samples);
    } else {
      this.samples = [];
      samples = request.samples;
    }
    let sampleNumber = 1;
    for (const val of samples) {
      // console.log(val);
      if (this.isLocal) {
        const item = new Itemerino(
          'Unknown',
          val,
          'none',
          'none',
          0,
          this.clientCode,
          '',
          this.request.id,
          this.taxonomyCode,
          'Unknown',
          sampleNumber,
          false
        );
        this.samples.push(item);
      } else {
        // For Agendo, info is in val.code
        // If empty value, we skip
        if (val.code === '') {
          continue;
        }
        if (!this.clientCode) {
          this.clientCode = this.generateClientCode(val.code.replace(/\|/g, '_'));
        }
        const item = new Itemerino(
          'Unknown',
          val.code.replace(/\|/g, '_') + '_01',
          'none',
          'none',
          0,
          this.clientCode,
          '',
          this.request.id,
          this.taxonomyCode,
          'Unknown',
          sampleNumber,
          false
        );
        this.samples.push(item);
      }
      sampleNumber = sampleNumber + 1;
      // this.samples.push(val[0].value.replace(/\|/g, '_'));
    }
    this.dataSource = this.samples;
    this.cloneGlobal = this.samples;
  }

  private getDatabaseFromRequest(): string {
    if (this.isLocal) {
      return 'none';
    }
    for (const item of this.request.fields) {
      if (item.name === 'QSample-DB') {
        return item.value;
      }
    }
    return '';
  }

  private getTaxonomyFromRequest(): string {
    if (this.isLocal) {
      return this.request.localTaxonomy;
    } else {
      for (const item of this.request.fields) {
        if (item.name === 'Taxonomy') {
          return item.value;
        }
      }
    }
  }

  private getTaxonomyCodeFromName(taxonomyName: string): number {
    switch (taxonomyName) {
      case 'Human':
        return 9606;
      default:
        return undefined;
    }
  }

  public goBack(): void {
    this.router.navigate(['/request', this.requestCode]);
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.samples, event.previousIndex, event.currentIndex);
  }

  public addQC(type: string, index: number, associated?: boolean) {
    switch (type) {
      case 'QC01':
        switch (associated) {
          case true:
            const sampleNumber = this.getPositionFromSampleName(this.dataSource[index].filename);
            const qcNumber = this.getQCsByTypeBetweenIndexs(
              index,
              this.getNextSampleIndexGivenActualIndex(index),
              type
            );
            this.dataSource.splice(
              this.getNextSampleIndexGivenActualIndex(index),
              0,
              new Itemerino(
                'QC',
                // tslint:disable-next-line:max-line-length
                `${this.requestCode}_${this.clientCode}_${sampleNumber}_${this.year}${this.month}${
                  this.day
                }_${type}_001_${('0' + qcNumber).slice(-2)}`,
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).method,
                this.getVialPositionByQCType(type),
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).volume,
                this.clientCode,
                '',
                this.dataSource[0].agendoId,
                undefined,
                type,
                undefined,
                true
              )
            );
            break;
          case false:
            this.dataSource.splice(
              this.getNextSampleIndexGivenActualIndex(index),
              0,
              new Itemerino(
                'QC',
                // tslint:disable-next-line:max-line-length
                `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc1Counter).slice(-2)}`,
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).method,
                this.getVialPositionByQCType(type),
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).volume,
                'QC01',
                '',
                '',
                undefined,
                type,
                undefined,
                false
              )
            );
            this.qc1Counter = this.qc1Counter + 1;
            break;
        }

        break;
      case 'QC02':
        this.dataSource.splice(
          this.getNextSampleIndexGivenActualIndex(index),
          0,
          new Itemerino(
            'QC',
            // tslint:disable-next-line:max-line-length
            `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc2Counter).slice(-2)}_100ng`,
            // tslint:disable-next-line:max-line-length
            this.getMethodAndVolumeQC(this.selectedInstrument, type).method,
            this.getVialPositionByQCType(type),
            // tslint:disable-next-line:max-line-length
            this.getMethodAndVolumeQC(this.selectedInstrument, type).volume,
            'QC02',
            '',
            '',
            undefined,
            type,
            undefined,
            false
          )
        );
        this.qc2Counter = this.qc2Counter + 1;
        break;
      case 'QC03':
        this.dataSource.splice(
          this.getNextSampleIndexGivenActualIndex(index),
          0,
          new Itemerino(
            'QC',
            // tslint:disable-next-line:max-line-length
            `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc3Counter).slice(-2)}_25ng`,
            // tslint:disable-next-line:max-line-length
            this.getMethodAndVolumeQC(this.selectedInstrument, type).method,
            this.getVialPositionByQCType(type),
            // tslint:disable-next-line:max-line-length
            this.getMethodAndVolumeQC(this.selectedInstrument, type).volume,
            'QC03',
            '',
            '',
            undefined,
            type,
            undefined,
            false
          )
        );
        this.qc3Counter = this.qc3Counter + 1;
        break;
      case 'QBSA':
        switch (associated) {
          case true:
            const sampleNumber = this.getPositionFromSampleName(this.dataSource[index].filename);
            const qcNumber = this.getQCsByTypeBetweenIndexs(
              index,
              this.getNextSampleIndexGivenActualIndex(index),
              type
            );
            this.dataSource.splice(
              this.getNextSampleIndexGivenActualIndex(index),
              0,
              new Itemerino(
                'QC',
                // tslint:disable-next-line:max-line-length
                `${this.requestCode}_${this.clientCode}_${sampleNumber}_${this.year}${this.month}${
                  this.day
                }_${type}_001_${('0' + qcNumber).slice(-2)}`,
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).method,
                this.getVialPositionByQCType(type),
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).volume,
                this.clientCode,
                '',
                this.dataSource[0].agendoId,
                undefined,
                type,
                undefined,
                true
              )
            );
            break;
          case false:
            this.dataSource.splice(
              this.getNextSampleIndexGivenActualIndex(index),
              0,
              new Itemerino(
                'QC',
                // tslint:disable-next-line:max-line-length
                `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qBSACounter).slice(-2)}`,
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).method,
                this.getVialPositionByQCType(type),
                // tslint:disable-next-line:max-line-length
                this.getMethodAndVolumeQC(this.selectedInstrument, type).volume,
                'QBSA',
                '',
                '',
                undefined,
                type,
                undefined,
                false
              )
            );
            this.qBSACounter = this.qBSACounter + 1;

            break;
        }

        break;
      case 'QHELA':
        this.dataSource.splice(
          this.getNextSampleIndexGivenActualIndex(index),
          0,
          new Itemerino(
            'QC',
            // tslint:disable-next-line:max-line-length
            `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qHELACounter).slice(-2)}_1ug`,
            // tslint:disable-next-line:max-line-length
            this.getMethodAndVolumeQC(this.selectedInstrument, type).method,
            this.getVialPositionByQCType(type),
            // tslint:disable-next-line:max-line-length
            this.getMethodAndVolumeQC(this.selectedInstrument, type).volume,
            'QHELA',
            '',
            '',
            undefined,
            type,
            undefined,
            false
          )
        );
        this.qHELACounter = this.qHELACounter + 1;
        break;

      default:
        break;
    }
    this.table.renderRows();
  }

  getQCsByTypeBetweenIndexs(indexStart: number, indexEnd: number, type: string) {
    let counter = 1;
    for (let i = indexStart + 1; i < indexEnd; i++) {
      if (this.dataSource[i].sampleType !== 'Unknown') {
        if (this.dataSource[i].qcType === type && this.dataSource[i].associated) {
          counter = counter + 1;
        }
      } else {
        return counter;
      }
    }
    return counter;
  }

  getNextSampleIndexGivenActualIndex(index: number) {
    let i = index + 1;

    while (i < this.dataSource.length) {
      if (this.dataSource[i].sampleType === 'Unknown') {
        return i;
      }
      i++;
    }
    return this.dataSource.length; // the last sample
  }

  dropTable(event: CdkDragDrop<Itemerino[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  public autoQC(): void {
    // TODO repair this
    this.dataSource = this.removeQCsFromList(this.dataSource);
    const clone: Itemerino[] = [];
    const clone2 = [];
    this.dataSource.forEach((val) => clone.push(Object.assign({}, val)));
    this.dataSource.forEach((val) => clone2.push(Object.assign({}, val)));
    this.dataSource = [];
    for (const sample of clone) {
      this.dataSource.push(sample);
      this.dataSource.push(
        new Itemerino(
          'QC',
          // tslint:disable-next-line:max-line-length
          `${this.requestCode}_${this.clientCode}_${this.getPositionFromSampleName(sample.filename)}_${this.year}${
            this.month
          }${this.day}_QBSA_001_01`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QBSA').method,
          this.getVialPositionByQCType('QBSA'),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QBSA').volume,
          this.clientCode,
          '',
          this.dataSource[0].agendoId,
          undefined,
          'QBSA',
          undefined,
          true
        )
      );

      this.dataSource.push(
        new Itemerino(
          'QC',
          // tslint:disable-next-line:max-line-length
          `${this.requestCode}_${this.clientCode}_${this.getPositionFromSampleName(sample.filename)}_${this.year}${
            this.month
          }${this.day}_QC01_001_01`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QC01').method,
          this.getVialPositionByQCType('QC01'),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QC01').volume,
          this.clientCode,
          '',
          this.dataSource[0].agendoId,
          undefined,
          'QC01',
          undefined,
          true
        )
      );
    }
    this.table.renderRows();
  }

  private removeQCsFromList(list: Itemerino[]): Itemerino[] {
    return list.filter((ele) => ele.sampleType === 'Unknown');
  }

  public qHelaCombo(position: number): void {
    this.addQC('QHELA', position, false);
    this.addQC('QBSA', position, false);
    this.addQC('QC01', position, false);
    this.table.renderRows();
  }

  public fullCombo(position: number): void {
    this.addQC('QC03', position, false);
    this.addQC('QC02', position, false);
    this.addQC('QC01', position, false);

    this.table.renderRows();
  }

  public editRow(item: Itemerino, i: number): void {
    this.openDialog(item);
  }

  public editFilename(element: any) {
    element.isEditing = true;
  }

  public saveFilename(element: any) {
    element.isEditing = false;
  }

  // We append text value to the different filenames
  public appendToFilenames(value: string): void {
    const elements = document.querySelectorAll('.filename');
    elements.forEach((element) => {
      element.textContent += value;
    });
    // element.filename = element.textContent;
    let newDataSource = [];
    this.dataSource.forEach((element) => {
      element.filename = element.filename + value;
      newDataSource.push(element);
    });
    this.dataSource = newDataSource;
  }

  public deleteRow(item: Itemerino, i: number): void {
    this.dataSource.splice(this.dataSource.indexOf(item), 1);
    this.table.renderRows();
  }

  private openDialog(item: Itemerino): void {
    const dialogRef = this.dialog.open(QGeneratorDialogComponent, {
      data: {
        item,
      },
    });
  }

  private getVialPositionByQCType(qcType: string): any {
    switch (qcType) {
      case 'QBSA':
      case 'QC01':
      case 'QC':
        return '1-V1';
      case 'QC02':
        return '1-V2';
      case 'QHELA':
        return '1-V4';
      case 'QC03':
        return '1-V3';
    }
  }

  private getMethodAndVolumeQC(instrument: Instrument, qcType: string): any {
    if (instrument === undefined) {
      return { method: 'none', volume: 1 };
    }
    for (const injCond of this.injectionConditionsQC) {
      if (qcType === injCond.qctype) {
        return { method: injCond.method, volume: injCond.volume };
      }
    }
  }

  public generateCSV(): void {
    const separator = ',';
    // tslint:disable-next-line:max-line-length
    const header = `Bracket Type=4\nSample Type${separator}File Name${separator}Path${separator}Instrument Method${separator}Position${separator}Inj Vol${separator}L2 Client${separator}L4 AgendoId${separator}L5 Database${separator}Comment\n`;
    let csvString: string = header;
    for (const item of this.dataSource) {
      if (item.sampleType === 'Unknown') {
        // tslint:disable-next-line:max-line-length
        csvString = `${csvString}${item.sampleType}${separator}${item.filename}${separator}${this.path}${separator}${this.methodPath}${item.method}${separator}${item.position}${separator}${item.volume}${separator}${item.client}${separator}${item.agendoId}${separator}${this.databaseCode}${separator}${item.comment}\n`;
      } else {
        // tslint:disable-next-line:max-line-length
        csvString = `${csvString}${item.sampleType}${separator}${item.filename}${separator}${this.path}${separator}${this.methodPath}${item.method}${separator}${item.position}${separator}${item.volume}${separator}${item.client}${separator}${item.agendoId}${separator}${separator}${item.comment}\n`;
      }
    }
    const blob = new Blob([csvString], { type: 'text/csv' });
    saveAs(blob, `${this.requestCode}.csv`);
  }

  public changeInstrument(): void {
    this.getMethodsByAppNameAndInstrumentId();
    this.getInstrumentInjectionConditionsQC();
  }

  private getInstrumentInjectionConditionsQC(): void {
    this.injectionConditionQCService.findByInstrumentId(this.selectedInstrument).subscribe(
      (res) => {
        this.injectionConditionsQC = res;
        this.applyInjectionConditions();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getPositionFromSampleName(name: string): string {
    const splited = name.split('_');
    return splited[splited.length - 2];
  }

  private subscribeToSelectedPeptidesList(): void {
    this.csvSubscription = this.qGeneratorService.getCSV().subscribe((csv) => {
      this.processCSV(csv);
    });
  }

  private processCSV(csv: string[]): void {
    if (this.dataSource.length !== this.samples.length) {
      if (!confirm('All QCs will be removed')) {
        return;
      }
    }
    const result = [];
    if (this.checkCorrectCSV(csv)) {
      for (const line of csv.slice(1)) {
        // we dont need the headers
        const lineName = line.split(';')[0].replace(/(\r\n|\n|\r)/gm, '');
        // Open Office calc and MS Excel puts a new line char at the end of every line
        const lineSamplePosition = line.split(';')[1];
        for (const sample of this.samples) {
          if (lineName === sample.filename) {
            sample.position = lineSamplePosition.replace(/(\r\n|\n|\r)/gm, '');
            result.push(sample);
          }
        }
      }
      this.dataSource = result;
      this.table.renderRows();
      this.openSnackBar('CSV positions applied', 'Close');
    }
  }

  private checkCorrectCSV(csv: string[]): boolean {
    if (csv[csv.length - 1] === ''.trim()) {
      // We check if the last line is empty
      csv.pop();
    }
    const header = csv[0].split(';');
    if (csv.length - 1 !== this.samples.length) {
      this.openSnackBar('The CSV lines do not match the number of samples', 'Close');
      return false;
    }
    if (header.length === 2 && header[0].trim() === 'sample name' && header[1].trim() === 'position') {
      for (const line of csv.slice(1)) {
        // slice to skip the header (the first line)
        const lineSplitted = line.split(';');
        if (lineSplitted.length !== 2) {
          this.openSnackBar('One or more lines with bad length', 'Close');
          return false;
        }
        for (const item of lineSplitted) {
          if (item.trim() === '') {
            this.openSnackBar('Some CSV item blank', 'Close');
            return false;
          }
        }
      }
    } else {
      this.openSnackBar('Bad headers', 'Close');
      return false;
    }
    return true;
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 6000,
    });
  }

  private hasDuplicates<T>(array: Array<T>): boolean {
    const asSet: Set<T> = new Set();
    for (const x of array) {
      if (asSet.has(x)) {
        return true;
      }
      asSet.add(x);
    }
    return false;
  }
}

export class Itemerino {
  sampleType: string;
  filename: string;
  method: string;
  position: string;
  volume: number;
  client: string;
  comment: string;
  agendoId: string;
  taxonomyId: number;
  qcType: string;
  sampleNumber: number;
  associated: boolean;

  constructor(
    sampleType: string,
    filename: string,
    method: string,
    position: string,
    volume: number,
    client: string,
    comment: string,
    agendoId: string,
    taxonomyId: number,
    qcType: string,
    sampleNumber: number,
    associated: boolean
  ) {
    this.sampleType = sampleType;
    this.filename = filename;
    this.method = method;
    this.position = position;
    this.volume = volume;
    this.client = client;
    this.comment = comment;
    this.agendoId = agendoId;
    this.taxonomyId = taxonomyId;
    this.qcType = qcType;
    this.sampleNumber = sampleNumber;
    this.associated = associated;
  }
}
