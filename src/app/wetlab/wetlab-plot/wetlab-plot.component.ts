import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { WetLab } from '../../models/WetLab';
import { PlotTrace } from '../../models/PlotTrace';
import { Subscription } from 'rxjs';
import { ThemeSelectorComponent } from '../../page/top-bar/theme-selector/theme-selector.component';
import { ThemeService } from '../../services/theme.service';
import { LAYOUTDARK, LAYOUTLIGHT } from './plot.utils'
import { ThresholdService } from '../../services/threshold.service';
import { Threshold } from '../../models/Threshold';
import { ThresholdForPlot } from '../../models/ThresholdForPlot';
declare var Plotly: any;

@Component({
  selector: 'app-wetlab-plot',
  templateUrl: './wetlab-plot.component.html',
  styleUrls: ['./wetlab-plot.component.css']
})
export class WetlabPlotComponent implements OnInit {

  constructor(private dataService: DataService, private themeService: ThemeService, private threholdService: ThresholdService) { }

  @ViewChild("Graph", { static: true })
  private Graph: ElementRef;

  @Input("plot") plot;

  @Input("wetlab") wetlab: WetLab;

  layout: any = {};

  dateChangesSubscription$: Subscription;

  themeChangesSubscription$: Subscription;

  themeColor: string;

  currentDates: Date[];

  randString = '';

  noDataFound = false;

  hasThreshold = false;


  ngOnInit(): void {
    this.layout.shapes = [];
    this.themeColor = this.themeService.currentTheme;
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.getData();
    this.subscribeToDateChanges();
    this.subscribeToThemeChanges();
  }

  ngOnDestroy() {
    Plotly.purge(`Graph${this.randString}`);
    this.dateChangesSubscription$.unsubscribe();
    this.themeChangesSubscription$.unsubscribe();
  }

  plotTrace: PlotTrace[];

  private getData(): void {
    this.dataService.getDataForPlot(this.plot.id, this.wetlab.apiKey).subscribe(
      res => {
        this.plotTrace = res;
        if (this.plotTrace.length !== 0) { // Check the server have returned data
          this.plotGraph();
          this.noDataFound = false;
          this.loadThreshold();
        } else {
          this.noDataFound = true;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  plotGraph() {
    const dataForPlot = [];
    this.plotTrace.forEach(
      plotTrace => {
        const errorBar = [];
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
            errorBar.push(plotTracePoint.std);
          }
        );
        const trace = {
          x: filenames,
          y: values,
          type: 'bar',
          name: plotTrace.abbreviated,
          filenames: filenames,
          error_y: {
            type: 'data',
            array: errorBar,
            color: '#85144B',
            visible: true
          },
        }
        dataForPlot.push(trace);
      }
    );
    if (this.themeColor === 'dark-theme') {
      this.layout = LAYOUTDARK;
    } else if (this.themeColor === 'light-theme') {
      this.layout = LAYOUTLIGHT;
    }
    this.layout.title = this.plot.name;
    if (!this.hasThreshold) {
      this.layout.shapes = [];
    }
    Plotly.react(`Graph${this.randString}`, dataForPlot, this.layout);
    setTimeout(() => {  // The timeout is necessary because the PLOT isnt instant
      let plotSVG = document.getElementsByClassName('main-svg')[0];  // the only way because this inst plotly native LUL
      (plotSVG as any).style["border-radius"] = '4px';
    }, 100);

  }


  private loadThreshold(): void {
    this.threholdService.getThresholdForPlot(this.plot.apiKey, this.wetlab.apiKey).subscribe(
      res => {
        if (res != null) {
          this.drawThreshold(res);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  private drawThreshold(thresholdToDraw: ThresholdForPlot): void {
    this.hasThreshold = true;
    const shapes: any[] = [];
    for (let i = 0; i < thresholdToDraw.steps; i++) {
      const shape = {
        type: 'rect',
        x0: 0,
        x1: 1,
        y0: thresholdToDraw.initialValue + ((i + 1) * thresholdToDraw.stepValue),
        y1: thresholdToDraw.initialValue - ((i + 1) * thresholdToDraw.stepValue),
        xref: 'paper',
        fillcolor: 'red',
        opacity: 0.5,
        line: {
          color: 'red',
          width: 0
        },
        layer: 'below'
      };
      shapes.push(shape);
    }
    this.layout.shapes = shapes;
    this.plotGraph();
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

  private subscribeToThemeChanges(): void {
    this.themeChangesSubscription$ = this.themeService.selectedTheme$.subscribe(
      theme => {
        this.themeColor = theme;
        this.reLayout();
      }
    )
  }

  private reLayout(): void {
    let update = {};
    switch (this.themeColor) {
      case 'dark-theme':
        update = {
          plot_bgcolor: "#424242",
          paper_bgcolor: "#424242",
          font: {
            color: '#FFFFFF'
          }
        }
        break;
      case 'light-theme':
        update = {
          plot_bgcolor: "white",
          paper_bgcolor: "white",
          font: {
            color: 'black'
          }
        }
        break;
    }
    this.getData();
  }

}
