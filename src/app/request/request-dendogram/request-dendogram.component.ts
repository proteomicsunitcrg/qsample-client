import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlotService } from '../../services/plot.service';
import { QuantificationService } from '../../services/quantification.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ThemeService } from '../../services/theme.service';

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

  // Subscription to update the plot on theme change
  themeChangesSubscription$: Subscription;

  // The current colot schema
  themeColor: string;

  // Subscription to update the plot on list change
  fileListChangesSubscription$: Subscription;


  constructor(private quantificationService: QuantificationService, private plotService: PlotService, private sanitizer: DomSanitizer, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeColor = this.themeService.currentTheme;
    this.subscribeToListChanges();
    this.subscribeToThemeChanges();
  }

  ngOnDestroy(): void {
    this.fileListChangesSubscription$.unsubscribe();
    this.themeChangesSubscription$.unsubscribe();
  }

  private getDendogramData(): void {
    this.showImg = false;
    if (this.listOfChecksum.length <= 1) {
      this.errorMessage = 'Choose more than one sample to view the dendogram';
      this.loading = false;
      return;
    }
    this.loading = true;
    this.quantificationService.getDendogram(this.requestCode, this.listOfChecksum, this.themeColor).subscribe(
      res => {
        let unsafeImageUrl = URL.createObjectURL(res);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        this.showImg = true;
        this.loading = false;
        this.errorMessage = '';
      },
      err => {
        if (err.status === 409) {
          this.errorMessage = 'Neon API error, contact the admin (Marc) to check the case in depth';
        }
        else if (err.status === 404) {
          this.errorMessage = 'Neon API endpoint down, contact the admin (Marc) to check the case in depth';
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

  /**
  * Subsc ribes to theme changes
  */
  private subscribeToThemeChanges(): void {
    this.themeChangesSubscription$ = this.themeService.selectedTheme$.subscribe(
      theme => {
        this.themeColor = theme;
        this.getDendogramData();
      }
    );
  }

}
