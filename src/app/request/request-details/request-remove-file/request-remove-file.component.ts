import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestFile } from '../../../models/RequestFile';
import { FileService } from '../../../services/file.service';
import { PlotService } from '../../../services/plot.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'app-request-remove-file',
  templateUrl: './request-remove-file.component.html',
  styleUrls: ['./request-remove-file.component.css']
})
export class RequestRemoveFileComponent implements OnInit, OnDestroy {

  selectedChecksumSubscription$: Subscription;

  file: RequestFile;

  nothingSelected = true;

  isAdmin = false;

  constructor(
    private plotService: PlotService,
    private fileService: FileService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.tokenStorageService.isAdminUser();
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

        this.nothingSelected = false;
        this.getFileInfo(checksum);
      }
    );
  }

  private getFileInfo(checksum: string): void {
    this.fileService.getRequestFileByChecksum(checksum).subscribe(
      res => {
        this.file = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  public removeFile(): void {
    if (!this.file) {
      return;
    }

    if (!window.confirm('Are you sure you want to remove this file?')) {
      return;
    }

    this.fileService.deleteFile(this.file.id).subscribe(
      () => {
        this.file = null;
        this.nothingSelected = true;
        this.plotService.notifyFileRemoved();
      },
      err => {
        console.error(err);
        window.alert('Could not remove the file.');
      }
    );
  }

}
