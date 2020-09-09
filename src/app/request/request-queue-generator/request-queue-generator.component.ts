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
            this.request = res;
            this.requestCode = this.getRequestCodeFromRequest(this.request);
            this.getSamplesFromRequests(this.request);
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
  displayedColumns: string[] = ['sampleType', 'filename', 'method', 'position', 'volume', 'edit', 'delete'];
  requestId: number;

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
    for(let item of this.dataSource) {
      if (item.sampleType === "Unkwown") {
        item.method = this.injectionCondition.method;
        item.volume = this.injectionCondition.volume;
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
    let cac = JSON.parse(request.fields[request.fields.length - 1].value);
    for (let val of cac) {
      let pedete = new Itemerino('Unkwown', val[0].value.replace(/\|/g, '_') + '_01', "none", "none", 0);
      this.samples.push(pedete);
      // this.samples.push(val[0].value.replace(/\|/g, '_'));
    }
    this.dataSource = this.samples;
  }

  public goBack(): void {
    this.router.navigate(['/request', this.requestId]);
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.samples, event.previousIndex, event.currentIndex);
  }

  public publicAddQCloud2(type: string, associated: boolean): void {
    let qcType: string;
    switch (type) {
      case 'bsa':
        qcType = 'QC01';
        break;
      case 'hela':
        qcType = 'QC02';
        break
      default:
        return;
    }
    if (associated) {
      this.dataSource.push(new Itemerino('QC', `${this.requestCode}_${this.clientCode}_001_${qcType}_${this.year}${this.month}${this.day}_${qcType}_001_01`, 'none', 'none', 1));
    } else {
      this.dataSource.push(new Itemerino('QC', `${this.year}${this.month}${this.day}_${qcType}_001_01`, 'none', 'none', 1));
    }
    this.table.renderRows();
  }

  public publicAddQ(type: string, associated: boolean): void {
    let qcType: string;
    switch (type) {
      case 'bsa':
        qcType = 'QBSA';
        break;
      case 'hela':
        qcType = 'QHELA';
        break
      default:
        return;
    }
    if (associated) {
      this.dataSource.push(new Itemerino('QC', `${this.requestCode}_${this.clientCode}_001_${qcType}_${this.year}${this.month}${this.day}_${qcType}_001_01`, 'none', 'none', 1));
    } else {
      this.dataSource.push(new Itemerino('QC', `${this.year}${this.month}${this.day}_${qcType}_001_01`, 'none', 'none', 1));
    }

    this.table.renderRows();
  }

  dropTable(event: CdkDragDrop<Itemerino[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  public autoQC(): void {
    if (confirm('All QCs will be removed')) {
      let backup = [];
      this.dataSource = this.samples.filter(item => item.sampleType != 'QC');
      for (let item of this.dataSource) {
        backup.push(item);
        backup.push(new Itemerino('QC', `${this.year}${this.month}${this.day}_QC1_001_01`, 'none', 'none', 1))
        backup.push(new Itemerino('QC', `${this.year}${this.month}${this.day}_QC1_001_01`, 'none', 'none', 1))
      }
      this.dataSource = backup;
      this.table.renderRows();
    }
  }

  public editRow(item: Itemerino, i: number): void {
    this.openDialog(item);
  }

  public deleteRow(item: Itemerino, i: number): void {
    this.dataSource.splice(this.dataSource.indexOf(item),1);
    this.table.renderRows();
  }

  private openDialog(item: Itemerino): void {
    const dialogRef = this.dialog.open(QGeneratorDialogComponent, {
      data: {
        item: item
      }
    });
  }

  public generateCSV(): void {
    console.log(this.dataSource);
  }

}

export class Itemerino {
  sampleType: string;
  filename: string;
  method: string;
  position: string;
  volume: number;

  constructor(sampleType: string, filename: string, method: string, position: string, volume: number) {
    this.sampleType = sampleType;
    this.filename = filename;
    this.method = method;
    this.position = position;
    this.volume = volume;
  }


}
