import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { qGeneratorService } from '../../services/qGenerator.service';
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

  constructor(private activeRouter: ActivatedRoute, private requestService: RequestService, private router: Router, private qGeneratorService: qGeneratorService, public dialog: MatDialog) {
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

  taxonomyCode: number

  request: any;

  requestCode: string;

  samples: any[] = [];

  year = new Date().getFullYear();

  month = ('0' + (new Date().getMonth() + 1)).slice(-2);

  day = ('0' + new Date().getDate()).slice(-2);

  dataSource: Itemerino[] = [];

  clientCode: string;

  availableInstruments: Instrument[] = [];

  selectedInstrument: Instrument;

  injectionCondition: InjectionCondition;

  path = 'C:\\Xcalibur\\Data';

  methodPath = 'C:\\Xcalibur\\methods\\current\\';

  qc1Counter = 0;

  qc2Counter = 0;

  qc3Counter = 0;

  qBSACounter = 0;

  qHELACounter = 0;



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
        if (this.injectionCondition != undefined) {
          this.applyInjectionConditions();
        }
      }, err => {
        console.error(err);
      }
    )
  }

  private applyInjectionConditions(): void {
    for (let item of this.dataSource) {
      if (item.sampleType === "Unknown") {
        item.method = this.injectionCondition.method;
        item.volume = this.injectionCondition.volume;
      } else {
        item.method = this.getMethodAndVolumeQC(this.selectedInstrument, item.qcType).method;
        item.volume = this.getMethodAndVolumeQC(this.selectedInstrument, item.qcType).volume;
      }
    }

  }

  private getRequestCodeFromRequest(request: any): string {
    let cac = JSON.parse(request.fields[request.fields.length - 1].value);
    this.clientCode = cac[0][0].value.split('|')[1];
    console.log(cac[0][0].value.split('|')[0]);
    return cac[0][0].value.split('|')[0];
  }

  private getSamplesFromRequests(request: any): void {
    this.samples = [];
    let cac = JSON.parse(request.fields[request.fields.length - 1].value);
    let sampleNumber = 1;
    for (let val of cac) {
      let pedete = new Itemerino('Unknown', val[0].value.replace(/\|/g, '_') + '_01', "none", "none", 0, this.clientCode, '', this.request.id, this.taxonomyCode, 'Unknown', sampleNumber, false);
      this.samples.push(pedete);
      sampleNumber = sampleNumber + 1;
      // this.samples.push(val[0].value.replace(/\|/g, '_'));
    }
    this.dataSource = this.samples;
  }

  private getTaxonomyFromRequest(): string {
    for (let item of this.request.fields) {
      if (item.name == 'Taxonomy') {
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

  public publicAddQCloud2(type: string, associated: boolean, position: number): void {
    let qcType: string;
    let counterToApply: number;
    let quantity: string = '';
    switch (type) {
      case 'bsa':
        if (!associated) {
          this.qc1Counter = this.qc1Counter + 1;
          counterToApply = this.qc1Counter;
        }
        qcType = 'QC01';
        break;
      case 'hela':
        if (!associated) {
          this.qc2Counter = this.qc2Counter + 1;
          counterToApply = this.qc2Counter;
          quantity = '_100ng';
        }
        qcType = 'QC02';
        break
      case 'qc4l':
        if (!associated) {
          this.qc3Counter = this.qc3Counter + 1;
          counterToApply = this.qc3Counter;
          quantity = '_25ng';
        }
        qcType = 'QC03';
        break;
      default:
        return;
    }
    let nextSampleIndex = this.getNextSample(this.dataSource[position - 1].sampleNumber);
      if (nextSampleIndex == undefined) {
        nextSampleIndex = position;
      }
    if (associated) {
      let qcNumber = this.getAssociatedQCsQuantityBetweenSamples(position, 'QC01') + 1;
      const sampleNumber = this.getLastSampleFromList(position).sampleNumber;
      this.dataSource.splice(nextSampleIndex, 0, new Itemerino('QC', `${this.requestCode}_${this.clientCode}_00${sampleNumber}_${this.year}${this.month}${this.day}_${qcType}_001_${('0' + qcNumber).slice(-2)}`, this.getMethodAndVolumeQC(this.selectedInstrument, qcType).method, this.getVialPositionByQCType(qcType), this.getMethodAndVolumeQC(this.selectedInstrument, qcType).volume, '', '', undefined, undefined, qcType, undefined, true));
    } else {
      this.dataSource.splice(nextSampleIndex, 0, new Itemerino('QC', `${this.year}${this.month}${this.day}_${qcType}_001_${('0' + counterToApply).slice(-2)}${quantity}`, this.getMethodAndVolumeQC(this.selectedInstrument, qcType).method, this.getVialPositionByQCType(qcType), this.getMethodAndVolumeQC(this.selectedInstrument, qcType).volume, '', '', undefined, undefined, qcType, undefined, false));
    }
    this.table.renderRows();
  }

  public publicAddQ(type: string, associated: boolean, position: number): void {
    let qcType: string;
    let counterToApply: number;
    let quantity: string = '';
    switch (type) {
      case 'bsa':
        if (!associated) {
          this.qBSACounter = this.qBSACounter + 1;
          counterToApply = this.qBSACounter;
        }
        qcType = 'QBSA';
        break;
      case 'hela':
        if (!associated) {
          this.qHELACounter = this.qHELACounter + 1;
          counterToApply = this.qHELACounter;
          quantity = '_1ug';
        }
        qcType = 'QHELA';
        break
      default:
        return;
    }
    let nextSampleIndex = this.getNextSample(this.dataSource[position - 1].sampleNumber);
      if (nextSampleIndex == undefined) {
        nextSampleIndex = position;
      }
    if (associated) {
      const sampleNumber = this.getLastSampleFromList(position).sampleNumber;
      let qcNumber = this.getAssociatedQCsQuantityBetweenSamples(position, 'QBSA') + 1;
      this.dataSource.splice(nextSampleIndex, 0, new Itemerino('QC', `${this.requestCode}_${this.clientCode}_00${sampleNumber}_${this.year}${this.month}${this.day}_${qcType}_001_${('0' + qcNumber).slice(-2)}`, this.getMethodAndVolumeQC(this.selectedInstrument, qcType).method, this.getVialPositionByQCType(qcType), this.getMethodAndVolumeQC(this.selectedInstrument, qcType).volume, '', '', undefined, undefined, qcType, undefined, true));
    } else {
      this.dataSource.splice(nextSampleIndex, 0, new Itemerino('QC', `${this.year}${this.month}${this.day}_${qcType}_001_${('0' + counterToApply).slice(-2)}${quantity}`, this.getMethodAndVolumeQC(this.selectedInstrument, qcType).method, this.getVialPositionByQCType(qcType), this.getMethodAndVolumeQC(this.selectedInstrument, qcType).volume, '', '', undefined, undefined, qcType, undefined, false));
    }
    this.table.renderRows();
  }

  dropTable(event: CdkDragDrop<Itemerino[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  private getAssociatedQCsQuantityBetweenSamples(position: number, qcTypeToFind: string) {
    let counter = 0;
    for (let i = position; i < this.dataSource.length; i++) {
      console.log(this.dataSource[i]);

      if (this.dataSource[i].sampleType == 'Unknown') {
        return counter;
      } else {
        if (this.dataSource[i].associated && this.dataSource[i].qcType == qcTypeToFind) {
          counter = counter + 1;
        }
      }
    }
    return counter;
  }

  private getNextSample(currentSampleNumber: number) {
    for (let [index,item] of this.dataSource.entries()) {
      if (item.sampleNumber == currentSampleNumber + 1) {
        return index;
      }
    }
    return this.dataSource.length;
  }

  private getLastSampleFromList(position: number): Itemerino {
    let i = position;
    while (i--) { // The fatest loop in the west https://web.archive.org/web/20110526000316/https://blogs.oracle.com/greimer/entry/best_way_to_code_a
      if (this.dataSource[i].sampleNumber != undefined) {
        return this.dataSource[i];
      }
    }
  }

  public autoQC(): void { //TODO repair this
    if (confirm("All QCs will be removed")) {
      this.getSamplesFromRequests(this.request);
      this.dataSource = [];
      for (let sample of this.samples) {
        this.dataSource.push(sample);
        this.publicAddQ('bsa', true, this.dataSource.length);
        this.publicAddQCloud2('bsa', true, this.dataSource.length);
      }
    }
  }

  public qHelaCombo(position: number): void {
    this.publicAddQ('hela', false, position);
    this.publicAddQ('bsa', false, position + 1);
    this.publicAddQCloud2('bsa', false, position + 2);
    this.table.renderRows();
  }

  public fullCombo(position: number): void {
    this.publicAddQCloud2('bsa', false, position);
    this.publicAddQCloud2('hela', false, position);
    this.publicAddQCloud2('qc4l', false, position);
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
        item: item
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
      return { 'method': 'none', 'volume': 1 };
    }
    switch (instrument.name) {
      case 'Lumos':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { 'method': 'STD-L1-BSA-8min-T3-HCD-IT', 'volume': 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { 'method': 'STD-L1-QC02-60min-TSP-HCD-IT_max2ul', 'volume': 1 };
            break;
          case 'QC03':
            return { 'method': 'QC4L-Fusion-Lumos', 'volume': 1 };
            break;
          default:
            return { 'method': 'none', 'volume': 1 };
            break;
        }
        break;
      case 'Velos':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { 'method': 'STD-VL-BSA-8min-T3-CID-IT', 'volume': 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { 'method': 'STD-VL-QC02-60min-T20-CID-IT', 'volume': 1 };
            break;
          case 'QC03':
            return { 'method': 'STD-VL-DDA-60min-T4-CID-IT-HCD-FT-QC4L', 'volume': 1 };
            break;
          default:
            return { 'method': 'none', 'volume': 1 };
            break;
        }
        break;
      case 'Eclipse':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { 'method': 'STD-EU-BSA-8min-T3-HCD-IT', 'volume': 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { 'method': 'STD-EU-QC02-60min-TSP-HCD-IT_max2ul', 'volume': 1 };
            break;
          case 'QC03':
            return { 'method': 'QC4L-Eclipse', 'volume': 1 };
            break;
          default:
            return { 'method': 'none', 'volume': 1 };
            break;
        }
        break;
      case 'XL':
        switch (qcType) {
          case 'QBSA':
          case 'QC01':
          case 'QC':
            return { 'method': 'STD-XL-BSA-8min-T3-CID-IT', 'volume': 0.5 };
            break;
          case 'QC02':
          case 'QHELA':
            return { 'method': 'STD-XL-60min-T10-CID-IT', 'volume': 1 };
            break;
          case 'QC03':
            return { 'method': 'STD-XL-DDA-60min-T4-CID-IT-HCD-FT-QC4L', 'volume': 1 };
            break;
          default:
            return { 'method': 'none', 'volume': 1 };
            break;
        }
      default:
        return { 'method': 'none', 'volume': 1 };
        break;
    }
  }

  public generateCSV(): void {
    console.log(this.dataSource);
    const separator = ';';
    const header = `Sample Type${separator}File Name${separator}Inst Meth${separator}Position${separator}Inj Vol${separator}Path${separator}Client${separator}Comment${separator}AgendoId${separator}TaxonomyId\n`;
    let csvString: string = header;
    for (let item of this.dataSource) {
      if (item.sampleType == 'Unknown') {
        csvString = `${csvString}${item.sampleType}${separator}${item.filename}${separator}${this.methodPath}${item.method}${separator}${item.position}${separator}${item.volume}${separator}${this.path}${separator}${item.client}${separator}${item.comment}${separator}${item.agendoId}${separator}${item.taxonomyId}\n`;
      } else {
        csvString = `${csvString}${item.sampleType}${separator}${item.filename}${separator}${this.methodPath}${item.method}${separator}${item.position}${separator}${item.volume}${separator}${this.path}${separator}${item.client}${separator}${item.comment}${separator}${separator} \n`;
      }
    }
    var blob = new Blob([csvString], { type: 'text/csv' })
    saveAs(blob, `${this.requestCode}.csv`);
  }

  public changeInstrument(): void {
    this.getMethodsByAppNameAndInstrumentId();
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

  constructor(sampleType: string, filename: string, method: string, position: string, volume: number, client: string, comment: string, agendoId: number, taxonomyId: number, qcType: string, sampleNumber: number, associated: boolean) {
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
