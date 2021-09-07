import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { WetLab } from '../../models/WetLab';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { LAYOUTDARK, LAYOUTLIGHT, thresholdShapesDOWN, thresholdShapesUP, thresholdShapesUPDOWN } from './plot.utils';
import { ThresholdService } from '../../services/threshold.service';
import { Threshold } from '../../models/Threshold';
import { ThresholdForPlot } from '../../models/ThresholdForPlot';
import { PlotTraceWetlab } from 'src/app/models/PlotTraceWetlab';
declare var Plotly: any;

@Component({
  selector: 'app-wetlab-plot',
  templateUrl: './wetlab-plot.component.html',
  styleUrls: ['./wetlab-plot.component.css']
})
export class WetlabPlotComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataService, private themeService: ThemeService, private threholdService: ThresholdService) { }

  // The div element to draw the plot
  @ViewChild('Graph', { static: true })
  private Graph: ElementRef;

  // The plot to draw from parent
  // tslint:disable-next-line:no-input-rename
  @Input('plot') plot;

  // The current wetlab
  // tslint:disable-next-line:no-input-rename
  @Input('wetlab') wetlab: WetLab;

  // Var to handle the plot layout
  layout: any = {};

  // Subscription to update the plot on date change
  dateChangesSubscription$: Subscription;

  // Subscription to update the plot on theme change
  themeChangesSubscription$: Subscription;

  // The current colot schema
  themeColor: string;

  // The selected dates
  currentDates: String[];

  // Random string to generate de div and plot
  randString = '';

  // Flag to know if the plot has data
  noDataFound = false;

  // Flag to know if the plot has threshold to draw
  hasThreshold = false;

  // To store the plot data from server
  plotTrace: PlotTraceWetlab[];

  ngOnInit(): void {
    this.layout.shapes = [];
    this.themeColor = this.themeService.currentTheme;
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.getData();
    this.subscribeToDateChanges();
    this.subscribeToThemeChanges();
  }

  ngOnDestroy(): void {
    Plotly.purge(`Graph${this.randString}`);
    this.dateChangesSubscription$.unsubscribe();
    this.themeChangesSubscription$.unsubscribe();
  }


  /**
   * Asks the server for the plot data
   */
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

  /**
   * Draws the plot
   */
  plotGraph() {
    const dataForPlot = [];
    this.plotTrace.forEach(
      plotTrace => {
        const errorBar = [];
        const values = [];
        const filenames = [];
        const color = [];
        plotTrace.plotTracePoints.sort((obj1, obj2) => {
          if (obj1.order > obj2.order) {
            return 1;
          }
          if (obj1.order < obj2.order) {
            return -1;
          }
          return 0;
        });
        plotTrace.plotTracePoints.forEach(
          plotTracePoint => {
            values.push(plotTracePoint.value);
            filenames.push(plotTracePoint.name);
            color.push('red');
            errorBar.push(plotTracePoint.std);
          }
        );
        const trace = {
          x: filenames,
          y: values,
          type: 'bar',
          name: plotTrace.abbreviated,
          filenames, // same as filenames: filenames
          error_y: {
            type: 'data',
            array: errorBar,
            color: '#85144B',
            visible: true
          },
        };
        dataForPlot.push(trace);
      }
    );
    // Check current theme
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
      const plotsSVG = document.getElementsByClassName('main-svg');  // the only way because this inst plotly native LUL
      for (const ploterino of (plotsSVG as any)) {
        ploterino.style['border-radius'] = '4px';
      }
    }, 100);

  }


  /**
   * Asks the server for the threshold
   */
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

  /**
   * Draws the threshold
   */
  private drawThreshold(thresholdToDraw: ThresholdForPlot): void {
    this.hasThreshold = true;
    let shapes: any[] = [];
    switch (thresholdToDraw.direction) {
      case ('UP'):
        shapes = thresholdShapesUP(thresholdToDraw);
        break;
      case ('DOWN'):
        shapes = thresholdShapesDOWN(thresholdToDraw);
        break;
      case ('UPDOWN'):
        shapes = thresholdShapesUPDOWN(thresholdToDraw);
        break;
      default:
        console.log('bad direction!');
        break;
    }
    this.layout.shapes = shapes;
    this.plotGraph();
  }

  /**
   * Subscribe to the date changes
   */
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

  /**
   * Subscribes to theme changes
   */
  private subscribeToThemeChanges(): void {
    this.themeChangesSubscription$ = this.themeService.selectedTheme$.subscribe(
      theme => {
        this.themeColor = theme;
        this.reLayout();
      }
    );
  }

  /**
   * Relayouts the plot
   */
  private reLayout(): void {
    let update = {};
    switch (this.themeColor) {
      case 'dark-theme':
        update = {
          plot_bgcolor: '#424242',
          paper_bgcolor: '#424242',
          font: {
            color: '#FFFFFF'
          }
        };
        break;
      case 'light-theme':
        update = {
          plot_bgcolor: 'white',
          paper_bgcolor: 'white',
          font: {
            color: 'black'
          }
        };
        break;
    }
    this.getData();
  }

}
