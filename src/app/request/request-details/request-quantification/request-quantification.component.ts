import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
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

  // Subscription to update the plot on list change
  selectedChecksumSubscription$: Subscription;

  selectedChecksum: string;

  file: RequestFile;

  dataSource: MatTableDataSource<any>;

  dataSourceContaminants: MatTableDataSource<any>;

  columnsToDisplay = ['accession', 'abundance'];

  nothingSelected = true;

  proteinsEmpty = false;

  contaminantsEmpty = false;

  constructor(private quantificationService: QuantificationService, private plotService: PlotService, private fileService: FileService) { }

  ngOnInit(): void {
    this.subscribeToChecksumChanges()
  }

  ngOnDestroy(): void {
    this.selectedChecksumSubscription$.unsubscribe();
  }


  /**
   * Subscribes to list display changes
   */
  private subscribeToChecksumChanges(): void {
    this.selectedChecksumSubscription$ = this.plotService.selectedChecksum.subscribe(
      checksum => {
        console.log(checksum);
        this.selectedChecksum = checksum;
        this.getFileInfo();
        this.getQuantificationByFileChecksum();
        this.getQuantificationContaminantByFileChecksum();
      }
    );
  }

  private getQuantificationByFileChecksum() {
    this.quantificationService.getQuantificationByFileChecksumAndContaminant(this.selectedChecksum, false).subscribe(
      res => {
        if (res.length == 0) {
          this.proteinsEmpty = true;
        } else {
          this.proteinsEmpty = false;
        }
        this.dataSource = new MatTableDataSource(res);
        this.nothingSelected = false;
      },
      err => {
        console.error(err);
      }
    );
  }

  private getQuantificationContaminantByFileChecksum() {
    this.quantificationService.getQuantificationByFileChecksumAndContaminant(this.selectedChecksum, true).subscribe(
      res => {
        if (res.length == 0) {
          this.contaminantsEmpty = true;
        } else {
          this.contaminantsEmpty = false;
        }
        this.dataSourceContaminants = new MatTableDataSource(res);
        this.nothingSelected = false;
      },
      err => {
        console.error(err);
      }
    );
  }

  private getFileInfo() {
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
