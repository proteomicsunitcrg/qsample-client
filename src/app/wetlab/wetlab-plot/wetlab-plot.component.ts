import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var Plotly: any;

@Component({
  selector: 'app-wetlab-plot',
  templateUrl: './wetlab-plot.component.html',
  styleUrls: ['./wetlab-plot.component.css']
})
export class WetlabPlotComponent implements OnInit {

  constructor() { }

  @ViewChild("Graph", { static: true })
  private Graph: ElementRef;


  ngOnInit(): void {
    this.plotGraph();
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
    let trace1 = {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      name: 'SF Zoo',
      type: 'bar'
    };

    let trace2 = {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [12, 18, 29],
      name: 'LA Zoo',
      type: 'bar'
    };

    let data = [trace1, trace2];

    let layout = {barmode: 'group'};

    this.Graph = Plotly.newPlot(this.Graph.nativeElement, data, layout);
  }

}
