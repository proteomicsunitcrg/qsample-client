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



@Component({
  selector: 'app-request-queue-generator',
  templateUrl: './request-queue-generator.component.html',
  styleUrls: ['./request-queue-generator.component.css']
})
export class RequestQueueGeneratorComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private requestService: RequestService, private router: Router,
    private qGeneratorService: QGeneratorService, public dialog: MatDialog) {
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

  injectionCondition: InjectionCondition;

  path = 'C:\\Xcalibur\\Data';

  methodPath = 'C:\\Xcalibur\\methods\\current\\';

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
        this.injectionCondition = res;
        if (this.injectionCondition !== undefined) {
          this.applyInjectionConditions();
        }
      }, err => {
        console.error(err);
      }
    );
  }

  private applyInjectionConditions(): void {
    for (const item of this.dataSource) {
      if (item.sampleType === 'Unknown') {
        item.method = this.injectionCondition.method;
        item.volume = this.injectionCondition.volume;
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
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, '', '', undefined, undefined, type, undefined, true));
            break;
          case false:
            this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
              // tslint:disable-next-line:max-line-length
              `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc1Counter).slice(-2)}`,
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, '', '', undefined, undefined, type, undefined, false));
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
          this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, '', '', undefined, undefined, type, undefined, false));
        this.qc2Counter = this.qc2Counter + 1;
        break;
      case 'QC03':
        this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
          // tslint:disable-next-line:max-line-length
          `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qc3Counter).slice(-2)}_25ng`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, '', '', undefined, undefined, type, undefined, false));
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
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, '', '', undefined, undefined, type, undefined, true));
            break;
          case false:
            this.dataSource.splice(this.getNextSampleIndexGivenActualIndex(index), 0, new Itemerino('QC',
              // tslint:disable-next-line:max-line-length
              `${this.year}${this.month}${this.day}_${type}_001_${('0' + this.qBSACounter).slice(-2)}`,
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).method, this.getVialPositionByQCType(type),
              // tslint:disable-next-line:max-line-length
              this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, '', '', undefined, undefined, type, undefined, false));
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
          this.getMethodAndVolumeQC(this.selectedInstrument, type).volume, '', '', undefined, undefined, type, undefined, false));
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
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QBSA').volume, '', '', undefined, undefined, 'QBSA', undefined, true));

        this.dataSource.push(new Itemerino('QC',
          // tslint:disable-next-line:max-line-length
          `${this.requestCode}_${this.clientCode}_${this.getPositionFromSampleName(sample.filename)}_${this.year}${this.month}${this.day}_QC01_001_01`,
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QC01').method, this.getVialPositionByQCType('QC01'),
          // tslint:disable-next-line:max-line-length
          this.getMethodAndVolumeQC(this.selectedInstrument, 'QC01').volume, '', '', undefined, undefined, 'QC01', undefined, true));



        //   this.addQC('QBSA', this.dataSource.length, true);
        // this.addQC('QC01', this.dataSource.length, true);
        // this.publicAddQ('bsa', true, this.dataSource.length);
        // this.publicAddQCloud2('bsa', true, this.dataSource.length);

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
    switch (instrument.name) {
      case 'Lumos':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { method: 'STD-L1-BSA-8min-T3-HCD-IT', volume: 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { method: 'STD-L1-QC02-60min-TSP-HCD-IT_max2ul', volume: 1 };
            break;
          case 'QC03':
            return { method: 'QC4L-Fusion-Lumos', volume: 1 };
            break;
          default:
            return { method: 'none', volume: 1 };
            break;
        }
        break;
      case 'Velos':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { method: 'STD-VL-BSA-8min-T3-CID-IT', volume: 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { method: 'STD-VL-QC02-60min-T20-CID-IT', volume: 1 };
            break;
          case 'QC03':
            return { method: 'STD-VL-DDA-60min-T4-CID-IT-HCD-FT-QC4L', volume: 1 };
            break;
          default:
            return { method: 'none', volume: 1 };
            break;
        }
        break;
      case 'Eclipse':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { method: 'STD-EU-BSA-8min-T3-HCD-IT', volume: 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { method: 'STD-EU-QC02-60min-TSP-HCD-IT_max2ul', volume: 1 };
            break;
          case 'QC03':
            return { method: 'QC4L-Eclipse', volume: 1 };
            break;
          default:
            return { method: 'none', volume: 1 };
            break;
        }
        break;
      case 'XL':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { method: 'STD-XL-BSA-8min-T3-CID-IT', volume: 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { method: 'STD-XL-60min-T10-CID-IT', volume: 1 };
            break;
          case 'QC03':
            return { method: 'STD-XL-DDA-60min-T4-CID-IT-HCD-FT-QC4L', volume: 1 };
            break;
          default:
            return { method: 'none', volume: 1 };
            break;
        }
      default:
        return { method: 'none', volume: 1 };
        break;
    }
  }

  public generateCSV(): void {
    console.log(this.dataSource);
    const separator = ';';
    // tslint:disable-next-line:max-line-length
    const header = `Sample Type${separator}File Name${separator}Inst Meth${separator}Position${separator}Inj Vol${separator}Path${separator}Client${separator}AgendoId${separator}TaxonomyId${separator}Comment\n`;
    let csvString: string = header;
    for (const item of this.dataSource) {
      if (item.sampleType === 'Unknown') {
        // tslint:disable-next-line:max-line-length
        csvString = `${csvString}${item.sampleType}${separator}${item.filename}${separator}${this.methodPath}${item.method}${separator}${item.position}${separator}${item.volume}${separator}${this.path}${separator}${item.client}${separator}${item.agendoId}${separator}${item.taxonomyId}${separator}${item.comment}\n`;
      } else {
        // tslint:disable-next-line:max-line-length
        csvString = `${csvString}${item.sampleType}${separator}${item.filename}${separator}${this.methodPath}${item.method}${separator}${item.position}${separator}${item.volume}${separator}${this.path}${separator}${item.client}${separator}${separator}${item.comment} \n`;
      }
    }
    const blob = new Blob([csvString], { type: 'text/csv' });
    saveAs(blob, `${this.requestCode}.csv`);
  }

  public changeInstrument(): void {
    this.getMethodsByAppNameAndInstrumentId();
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
  agendoId: number;
  taxonomyId: number;
  qcType: string;
  sampleNumber: number;
  associated: boolean;

  constructor(sampleType: string, filename: string, method: string, position: string, volume: number, client: string, comment: string,
    agendoId: number, taxonomyId: number, qcType: string, sampleNumber: number, associated: boolean) {
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
