import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Subscription } from 'rxjs';
import { RequestFile } from '../../../models/RequestFile';
import { FileService } from '../../../services/file.service';
import { PlotService } from '../../../services/plot.service';
import { QuantificationService } from '../../../services/quantification.service';

@Component({
  selector: 'app-request-quantification',
  templateUrl: './request-quantification.component.html',
  styleUrls: ['./request-quantification.component.css']
})
export class RequestQuantificationComponent implements OnInit, OnDestroy {

  selectedChecksumSubscription$: Subscription;

  selectedChecksum: string;

  file: RequestFile;

  dataSource: MatTableDataSource<any>;

  dataSourceContaminants: MatTableDataSource<any>;

  columnsToDisplay = ['description', 'abundance'];

  nothingSelected = true;

  loading = false;

  quantificationChecked = false;

  proteinsEmpty = false;

  contaminantsEmpty = false;

  noQuantificationData = false;

  constructor(
    private quantificationService: QuantificationService,
    private plotService: PlotService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.subscribeToChecksumChanges();
  }

  ngOnDestroy(): void {
    this.selectedChecksumSubscription$.unsubscribe();
  }

  private subscribeToChecksumChanges(): void {
    this.selectedChecksumSubscription$ = this.plotService.selectedChecksum.subscribe(
      checksum => {

        if (!checksum) {
          return;
        }

        this.selectedChecksum = checksum;
        this.nothingSelected = false;
        this.loading = true;
        this.quantificationChecked = false;
        this.proteinsEmpty = false;
        this.contaminantsEmpty = false;
        this.noQuantificationData = false;

        this.getFileInfo();
        this.getQuantificationData();
      }
    );
  }

  private getQuantificationData(): void {
    forkJoin({
      proteins: this.quantificationService.getQuantificationByFileChecksumAndContaminant(this.selectedChecksum, false),
      contaminants: this.quantificationService.getQuantificationByFileChecksumAndContaminant(this.selectedChecksum, true)
    }).subscribe(
      res => {
        const proteins = res.proteins || [];
        const contaminants = res.contaminants || [];

        this.proteinsEmpty = proteins.length === 0;
        this.contaminantsEmpty = contaminants.length === 0;
        this.noQuantificationData = this.proteinsEmpty && this.contaminantsEmpty;

        this.dataSource = new MatTableDataSource(proteins);
        this.dataSourceContaminants = new MatTableDataSource(contaminants);

        this.quantificationChecked = true;
        this.loading = false;
      },
      err => {
        this.proteinsEmpty = true;
        this.contaminantsEmpty = true;
        this.noQuantificationData = true;
        this.quantificationChecked = true;
        this.loading = false;
        console.error(err);
      }
    );
  }

  private getFileInfo(): void {
    this.fileService.getRequestFileByChecksum(this.selectedChecksum).subscribe(
      res => {
        this.file = res;
      },
      err => {
        console.error(err);
      }
    );
  }

}