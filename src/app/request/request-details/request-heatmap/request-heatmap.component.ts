import { not } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlotService } from '../../../services/plot.service';
import { QuantificationService } from '../../../services/quantification.service';
import { LAYOUTDARKHEATMAP, LAYOUTLIGHTHEATMAP } from '../../../wetlab/wetlab-plot/plot.utils';

declare var Plotly: any;

@Component({
  selector: 'app-request-heatmap',
  templateUrl: './request-heatmap.component.html',
  styleUrls: ['./request-heatmap.component.css']
})
export class RequestHeatmapComponent implements OnInit, OnDestroy {

  constructor(private quantificationService: QuantificationService, private plotService: PlotService) { }

  // tslint:disable-next-line:no-input-rename
  @ViewChild('Graph', { static: true })
  private Graph: ElementRef;
  randString = '';

  @Input('requestCode') requestCode: string;

  data = [];

  // Subscription to update the plot on list change
  fileListChangesSubscription$: Subscription;

  selectedSamples = [];

  listOfChecksum: string[] = [];

  nothingFound = true;

  sliderValue = 20;

  loading = false;

  ngOnInit(): void {
    this.subscribeToListChanges();
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  ngOnDestroy(): void {
    this.fileListChangesSubscription$.unsubscribe();
  }

  private drawHeatMap(): void {
    // let data = [
    //   {
    //     z: [
    //       [1, null, 30, 50, 1],
    //       [20, 1, 60, 80, 30],
    //       [30, 60, 1, -10, 20]
    //       ],
    //     x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    //     y: ['Morning', 'Afternoon', 'Evening'],
    //     type: 'heatmap',
    //     hoverongaps: false
    //   }
    // ];
    this.loading = false;
    let data = [
      {
        z: this.data,
        x: this.selectedSamples.map(item => `sample ${item.filename.split('_')[2]}`),
        y: this.selectedSamples.map(item => `sample ${item.filename.split('_')[2]}`),
        w: 'cac',
        type: 'heatmap',
        hoverongaps: false,
        // colorscale: [
        //   ['0.0', 'rgb(0,0,0)'],
        //   ['0.2', 'rgb(0,0,250)'],
        //   ['0.4', 'rgb(118, 186, 255)'],
        //   ['0.5', 'rgb(255, 254, 232)'],
        //   ['0.6', 'rgb(255, 131, 127)'],
        //   ['0.8', 'rgb(254, 39, 0)'],
        //   ['1', 'rgb(255,0,0)'],
        // ]
        colorscale: 'RdGy',
      }
    ];
    Plotly.newPlot(`heatMap`, data, LAYOUTLIGHTHEATMAP, { responsive: true });

  }

  private getHeatMapData() {
    this.loading = true;
    this.quantificationService.getHeatMap(this.requestCode, this.listOfChecksum, this.sliderValue).subscribe(
      res => {
        if (res == null) {
          this.nothingFound = true;
        } else {
          this.nothingFound = false;
        }
        this.data = res;
        this.drawHeatMap();
      },
      err => {
        console.error(err);
      }
    );
  }

  /**
* Subscribes to list display changes
*/
  private subscribeToListChanges(): void {
    this.fileListChangesSubscription$ = this.plotService.selectedSamples.subscribe(
      list => {
        this.selectedSamples = list;
        this.listOfChecksum = this.selectedSamples.map(item => item.checksum);
        this.getHeatMapData();
      }
    );
  }

  public sliderChange(): void {
    this.getHeatMapData();
  }

}
