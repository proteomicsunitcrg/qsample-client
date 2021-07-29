import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlotService } from '../../../app/services/plot.service';
import { QuantificationService } from '../../../app/services/quantification.service';

@Component({
  selector: 'app-request-pca',
  templateUrl: './request-pca.component.html',
  styleUrls: ['./request-pca.component.css']
})
export class RequestPcaComponent implements OnInit {

  constructor(private quantificationService: QuantificationService, private plotService: PlotService) { }

  @Input('requestCode') requestCode: string;

    // Subscription to update the plot on list change
    fileListChangesSubscription$: Subscription;

    listOfChecksum: string[] = [];

    selectedSamples = [];

  ngOnInit(): void {
    this.getPCAData();
    this.subscribeToListChanges();
  }

  private getPCAData(): void {
    console.log('getting data');

    this.quantificationService.getPCA(this.requestCode, this.listOfChecksum).subscribe(
      res => {
        console.log(res);
        let arrayNew = res.map((elem,i) => `${i!==0?', ':''}${elem[0]}:${elem[1]}`).join("");
        console.log(arrayNew);
      },
      err => {
        console.log(err);
      }
    )
  }

    /**
* Subscribes to list display changes
*/
  private subscribeToListChanges(): void {
    this.fileListChangesSubscription$ = this.plotService.selectedSamples.subscribe(
      list => {
        this.selectedSamples = list;
        this.listOfChecksum = this.selectedSamples.map(item => item.checksum);
        // console.log(this.listOfChecksum);
        this.getPCAData();

      }
    );
  }
}
