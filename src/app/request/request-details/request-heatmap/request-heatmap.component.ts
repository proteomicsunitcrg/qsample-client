import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LAYOUTDARK, LAYOUTLIGHT } from '../../../wetlab/wetlab-plot/plot.utils';

declare var Plotly: any;

@Component({
  selector: 'app-request-heatmap',
  templateUrl: './request-heatmap.component.html',
  styleUrls: ['./request-heatmap.component.css']
})
export class RequestHeatmapComponent implements OnInit {

  constructor() { }

    // tslint:disable-next-line:no-input-rename
    @ViewChild('Graph', { static: true })
    private Graph: ElementRef;
    randString = '';

  ngOnInit(): void {
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.drawHeatMap();
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
    let data = [
      {
        z: [
          [1, null, 30, 50, 1],
          [20, 1, 60, 80, 30],
          [30, 60, 1, -10, 20],
          [30, 60, 1, 1, 20],
          [30, 60, 1, -10, 1],
          [30, 60, 1, -10, 20],
          [30, 60, 1, -10, 20],
          [30, 60, 1, -10, 20],
          [30, 60, 1, -10, 20],
          [30, 60, 1, -10, 20]
          ],
        x: ['Sample1', 'Sample2', 'Sample3', 'Sample4', 'Sample5'],
        y: ['Prot1', 'Prot2', 'Prot3', 'Prot4', 'Prot5', 'Prot6', 'Prot7', 'Prot8', 'Prot9', 'Prot10'],
        type: 'heatmap',
        hoverongaps: false
      }
    ];
    Plotly.newPlot(`heatMap`, data, {width: 700, height: 450}, {responsive: true});

  }

}
