import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlotService } from '../../services/plot.service';
import { QuantificationService } from '../../services/quantification.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-request-dendogram',
  templateUrl: './request-dendogram.component.html',
  styleUrls: ['./request-dendogram.component.css']
})
export class RequestDendogramComponent implements OnInit, OnDestroy {

  @Input('requestCode') requestCode: string;

  nothingFound = false;

  loading = false;

  showImg = false;

  listOfChecksum: string[] = [];

  selectedSamples = [];

  imageUrl: SafeUrl;

  errorMessage: string;



  // Subscription to update the plot on list change
  fileListChangesSubscription$: Subscription;


  constructor(private quantificationService: QuantificationService, private plotService: PlotService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.subscribeToListChanges();
  }

  ngOnDestroy(): void {
    this.fileListChangesSubscription$.unsubscribe();
  }

  private getDendogramData(): void {
    this.loading = true;
    this.quantificationService.getDendogram(this.requestCode, this.listOfChecksum).subscribe(
      res => {
        let unsafeImageUrl = URL.createObjectURL(res);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        this.showImg = true;
        this.loading = false;
      },
      err => {
        if (err.status === 409) {
          this.errorMessage = 'Neon API error, contact the admin (Marc) to check the case in depth';
        }
        this.loading = false;
        console.error(err);
      }
    );
  }

  private subscribeToListChanges(): void {
    this.fileListChangesSubscription$ = this.plotService.selectedSamples.subscribe(
      list => {
        this.selectedSamples = list;
        this.listOfChecksum = this.selectedSamples.map(item => item.checksum);
        // console.log(this.listOfChecksum);
        this.getDendogramData();
      }
    );
  }

}
