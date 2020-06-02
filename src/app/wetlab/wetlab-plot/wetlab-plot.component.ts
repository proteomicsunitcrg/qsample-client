import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { WetLab } from '../../models/WetLab';
import { PlotTrace } from '../../models/PlotTrace';
import { Subscription } from 'rxjs';
declare var Plotly: any;

@Component({
  selector: 'app-wetlab-plot',
  templateUrl: './wetlab-plot.component.html',
  styleUrls: ['./wetlab-plot.component.css']
})
export class WetlabPlotComponent implements OnInit {

  constructor(private dataService: DataService) { }

  @ViewChild("Graph", { static: true })
  private Graph: ElementRef;

  @Input("plot") plot;

  @Input("wetlab") wetlab: WetLab;

  layout: any;

  dateChangesSubscription$: Subscription;

  currentDates: Date[];

  randString = '';

  noDataFound = false;


  ngOnInit(): void {
    console.log(this.plot);

    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.getData();
    this.subscribeToDateChanges();
  }

  plotTrace: PlotTrace[];

  private getData(): void {
    this.dataService.getDataForPlot(this.plot.id, this.wetlab.apiKey).subscribe(
      res => {
        this.plotTrace = res;
        console.log(this.plotTrace);
        if (this.plotTrace.length !== 0) { // Check the server have returned data
          this.plotGraph();
          this.noDataFound = false;
        } else {
          this.noDataFound = true;
        }
        console.log(this.noDataFound);
      },
      err => {
        console.error(err);
      }
    );
  }

  plotGraph() {
    const values = [];
    const dataForPlot = [];
    this.plotTrace.forEach(
      plotTrace => {
        const values = [];
        const filenames = [];
        const dates = [];
        const color = [];
        plotTrace.plotTracePoints.forEach(
          plotTracePoint => {
            values.push(plotTracePoint.value);
            filenames.push(plotTracePoint.file.filename);
            dates.push(plotTracePoint.file.creationDate);
            color.push('red');
          }
        );
        const trace = {
          x: dates,
          y: values,
          type: 'bar',
          name: plotTrace.abbreviated,
          filenames: filenames
        }
        dataForPlot.push(trace);

      }
    );

    this.layout = {
      title: this.plot.name,
      shapes: [],
      hovermode: 'closest',
      plot_bgcolor: "#424242",
      paper_bgcolor: "#424242",
      barmode: 'group',
      xaxis: {
        nticks: 10,
        linecolor: '#FFFFFF',
        tickcolor: '#FFFFFF'
      },
      yaxis: {
        type: 'linear',
        linecolor: '#FFFFFF',
        tickcolor: '#FFFFFF'
        // range: rangeArray
      },
      font: {
        family: 'Roboto, monospace',
        color: '#FFFFFF'
      }

    };
    let layout = { barmode: 'group' };

    this.Graph = Plotly.react(`Graph${this.randString}`, dataForPlot, this.layout);
    setTimeout(() => {  // The timeout is necessary because the PLOT isnt instant
      let plotSVG = document.getElementsByClassName('main-svg')[0];  // the only way because this inst plotly native LUL
      console.log(plotSVG);
      (plotSVG as any).style["border-radius"] = '4px';
    }, 100);

  }

  private subscribeToDateChanges(): void {
    this.dateChangesSubscription$ = this.dataService.selectedDates$
      .subscribe(
        (dates) => {
          this.currentDates = dates;
          // reload the plot...
          this.getData();
        }
      );
  }

}
