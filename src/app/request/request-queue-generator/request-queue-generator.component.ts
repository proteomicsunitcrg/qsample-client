import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { QGeneratorService } from '../../services/qGenerator.service';
import { Instrument } from '../../models/Instrument';
import { InjectionCondition } from '../../models/InjectionCondition';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { QGeneratorDialogComponent } from './dialog/QGeneratorDialog.component';
import { saveAs } from 'file-saver';
import { MatGridList } from '@angular/material/grid-list';
import { Method } from '../../models/Method';
import { InjectionConditionQCService } from '../../services/injectionConditionsQC.service';
import { InjectionConditionQC } from '../../models/InjectionConditionQC';



@Component({
  selector: 'app-request-queue-generator',
  templateUrl: './request-queue-generator.component.html',
  styleUrls: ['./request-queue-generator.component.css']
})
export class RequestQueueGeneratorComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private requestService: RequestService, private router: Router,
    private qGeneratorService: QGeneratorService, public dialog: MatDialog, private injectionConditionQCService: InjectionConditionQCService) {
    this.activeRouter.params.subscribe(
      params => {
        this.requestId = params.apiKey;
        this.requestService.getRequestDetails(params.apiKey).subscribe(
          res => {
            console.log(res);
            this.request = res;
            this.requestCode = this.getRequestCodeFromRequest(this.request);
            this.getSamplesFromRequests(this.request);
            this.taxonomyCode = this.getTaxonomyCodeFromName(this.getTaxonomyFromRequest());
            this.databaseCode = this.getDatabaseFromRequest();
            console.log(this.databaseCode);
            this.requestService.changeRequestCode(this.requestCode);
            this.getAvailableInstruments();
          },
          err => {
            console.error(err);
          }
        );
      }
    );
  }
  @ViewChild('table') table: MatTable<Itemerino>;
  displayedColumns: string[] = ['sampleType', 'filename', 'method', 'position', 'volume', 'edit', 'delete', 'add'];
  requestId: number;

  taxonomyCode: number;

  request: any;

  requestCode: string;

  samples: any[] = [];

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



  ngOnInit(): void {
  }

  private getAvailableInstruments(): void {
    this.qGeneratorService.getAvailableInstruments(this.request.classs).subscribe(
      res => {
        this.availableInstruments = res;
        if (this.availableInstruments.length === 1) {
          this.selectedInstrument = this.availableInstruments[0];
          this.getMethodsByAppNameAndInstrumentId();
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  private getMethodsByAppNameAndInstrumentId(): void {
    this.qGeneratorService.getMethodsByAppNameAndInstrumentId(this.request.classs, this.selectedInstrument).subscribe(
      res => {
        console.log(res);

        this.injectionCondition = res;
        if (this.injectionCondition !== undefined) {
          this.applyInjectionConditions();
        }
      }, err => {
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
    const cac = JSON.parse(request.fields[request.fields.length - 1].value);
    this.clientCode = cac[0][0].value.split('|')[1];
    console.log(cac[0][0].value.split('|')[0]);
    return cac[0][0].value.split('|')[0];
  }


  private getSamplesFromRequests(request: any): void {
    this.samples = [];
    const cac = JSON.parse(request.fields[request.fields.length - 1].value);
    let sampleNumber = 1;
    for (const val of cac) {
      const pedete = new Itemerino('Unknown', val[0].value.replace(/\|/g, '_') + '_01', 'none', 'none', 0,
      this.clientCode, '', this.request.id, this.taxonomyCode, 'Unknown', sampleNumber, false);
      this.samples.push(pedete);
      sampleNumber = sampleNumber + 1;
      // this.samples.push(val[0].value.replace(/\|/g, '_'));
    }
    this.dataSource = this.samples;
    this.cloneGlobal = this.samples;
  }

  private getDatabaseFromRequest(): string {
    for (const item of this.request.fields) {
      if (item.name === 'Database') {
        return item.value;
      }
    }
    return '';
  }

  private getTaxonomyFromRequest(): string {
    for (const item of this.request.fields) {
      if (item.name === 'Taxonomy') {
        return item.value;
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
    this.router.navigate(['/request', this.requestId]);
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
            const qcNumber = this.getQCsByTypeBetweenIndexs(index, this.getNextSampleIndexGivenActualIndex(index), type);
            console.log(qcNumber);
            this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
              // tslint:disable-next-line:max-line-length
              `${this.requestCode}_${this.clientCode}_${sampleNumber}_${this.year}${this.month}${this.day}_${type}_001_${('0' + qcNumber).slice(-2)}`,
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, this.clientCode, '', this.dataSource[0].agendoId, undefined, type, undefined, true));
            break;
          case false:
            this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
              // tslint:disable-next-line:max-line-length
              `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc1Counter).slice(-2)}`,
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, 'QC01', '', '', undefined, type, undefined, false));
            this.qc1Counter = this.qc1Counter + 1;
            break;
        }

        break;
      case 'QC02':
        this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
          // tslint:disable-next-line:max-line-length
          `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc2Counter).slice(-2)}_100ng`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, 'QC02', '', '', undefined, type, undefined, false));
        this.qc2Counter = this.qc2Counter + 1;
        break;
      case 'QC03':
        this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
          // tslint:disable-next-line:max-line-length
          `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc3Counter).slice(-2)}_25ng`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, 'QC03', '', '', undefined, type, undefined, false));
        this.qc3Counter = this.qc3Counter + 1;
        break;
      case 'QBSA':
        switch (associated) {
          case true:
            const sampleNumber = this.getPositionFromSampleName(this.dataSource[index].filename);
            const qcNumber = this.getQCsByTypeBetweenIndexs(index, this.getNextSampleIndexGivenActualIndex(index), type);
            this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
              // tslint:disable-next-line:max-line-length
              `${this.requestCode}_${this.clientCode}_${sampleNumber}_${this.year}${this.month}${this.day}_${type}_001_${('0' + qcNumber).slice(-2)}`,
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, this.clientCode, '', this.dataSource[0].agendoId, undefined, type, undefined, true));
            break;
          case false:
            this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
              // tslint:disable-next-line:max-line-length
              `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qBSACounter).slice(-2)}`,
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, 'QBSA', '', '', undefined, type, undefined, false));
            this.qBSACounter = this.qBSACounter + 1;

            break;
        }

        break;
      case 'QHELA':
        this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
          // tslint:disable-next-line:max-line-length
          `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qHELACounter).slice(-2)}_1ug`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, 'QHELA', '', '', undefined, type, undefined, false));
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
        console.log(this.dataSource[i].filename);
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

  public autoQC(): void { // TODO repair this
    if (confirm('All QCs will be removed')) {
      this.dataSource = this.removeQCsFromList(this.dataSource);
      const clone: Itemerino[] = [];
      const clone2 = [];
      this.dataSource.forEach(val => clone.push(Object.assign({}, val)));
      this.dataSource.forEach(val => clone2.push(Object.assign({}, val)));
      this.dataSource = [];
      for (const sample of clone) {
        this.dataSource.push(sample);
        this.dataSource.push(new Itemerino('QC',
          // tslint:disable-next-line:max-line-length
          `${this.requestCode}_${this.clientCode}_${this.getPositionFromSampleName(sample.filename)}_${this.year}${this.month}${this.day}_QBSA_001_01`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QBSA').method, this.getVialPositionByQCType('QBSA'),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QBSA').volume, this.clientCode, '', this.dataSource[0].agendoId, undefined, 'QBSA', undefined, true));

        this.dataSource.push(new Itemerino('QC',
          // tslint:disable-next-line:max-line-length
          `${this.requestCode}_${this.clientCode}_${this.getPositionFromSampleName(sample.filename)}_${this.year}${this.month}${this.day}_QC01_001_01`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QC01').method, this.getVialPositionByQCType('QC01'),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QC01').volume, this.clientCode, '', this.dataSource[0].agendoId, undefined, 'QC01', undefined, true));
      }
    }
    this.table.renderRows();

  }

  private removeQCsFromList(list: Itemerino[]): Itemerino[] {
    return list.filter(ele => ele.sampleType === 'Unknown');
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

  public deleteRow(item: Itemerino, i: number): void {
    this.dataSource.splice(this.dataSource.indexOf(item), 1);
    this.table.renderRows();
  }

  private openDialog(item: Itemerino): void {
    const dialogRef = this.dialog.open(QGeneratorDialogComponent, {
      data: {
        item
      }
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
    for (let injCond of this.injectionConditionsQC) {
      if (qcType === injCond.qctype) {
        return { method: injCond.method, volume: injCond.volume };
      }
    }
  }

  public generateCSV(): void {
    console.log(this.dataSource);
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
      res => {
        this.injectionConditionsQC = res;
        this.applyInjectionConditions();

      },
      err => {
        console.error(err);
      }
    );
  }

  private getPositionFromSampleName(name: string): string {
    const splited = name.split('_');
    return splited[splited.length - 2];
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

  constructor(sampleType: string, filename: string, method: string, position: string, volume: number, client: string, comment: string,
    agendoId: string, taxonomyId: number, qcType: string, sampleNumber: number, associated: boolean) {
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
