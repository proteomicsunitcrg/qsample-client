import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { WetLab } from '../../models/WetLab';
import { PlotTrace } from '../../models/PlotTrace';
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

  ngOnInit(): void {
    this.getData();
  }

  plotTrace: PlotTrace[];

  private getData(): void {
    this.dataService.getDataForPlot("2019-01-01T00:00:00.000+02:00", "2033-01-01T00:00:00.000+02:00", this.plot.id, this.wetlab.apiKey).subscribe(
      res => {
        this.plotTrace = res;
        console.log(res);
        this.plotGraph();

      },
      err => {
        console.error(err);
      }
    );
  }

  plotGraph() {
    // let layout = {
    //   // paper_bgcolor:"grey",
    //   plot_bgcolor:"grey",

    // }
    // this.Graph = Plotly.newPlot(
    //   this.Graph.nativeElement,
    //   [{
    //     x: [1, 2, 3, 4, 5],
    //     y: [1, 2, 4, 8, 16] }],
    //     // layout,
    //   {
    //     autoexpand: "true",
    //     autosize: "true",
    //     // width: window.innerWidth - 200,
    //     margin: {
    //       autoexpand: "true",
    //       margin: 0
    //     },
    //     offset: 0,
    //     type: "scattergl",
    //     title: 'caca', //Title of the graph
    //     hovermode: "closest",
    //     xaxis: {
    //       linecolor: "black",
    //       linewidth: 2,
    //       mirror: true,
    //       title: "Time (s)",
    //       automargin: true
    //     },
    //     yaxis: {
    //       linecolor: "black",
    //       linewidth: 2,
    //       mirror: true,
    //       automargin: true,
    //       title: 'Any other Unit'
    //     },

    //   },
    //   {
    //     responsive: true,
    //     scrollZoom: true
    //   });
    // let trace1 = {
    //   x: ['giraffes', 'orangutans', 'monkeys'],
    //   y: [20, 14, 23],
    //   name: 'SF Zoo',
    //   type: 'bar'
    // };

    // let trace2 = {
    //   x: ['giraffes', 'orangutans', 'monkeys'],
    //   y: [12, 18, 29],
    //   name: 'LA Zoo',
    //   type: 'bar'
    // };

    // let data = [trace1, trace2];
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
      title: 'caca',
      shapes: [],
      hovermode: 'closest',
      xaxis: {
        nticks: 10,
      },
      yaxis: {
        type: 'linear',
        // range: rangeArray
      },

    };
    let layout = {barmode: 'group'};

    this.Graph = Plotly.newPlot(this.Graph.nativeElement, dataForPlot, layout);
  }

}
