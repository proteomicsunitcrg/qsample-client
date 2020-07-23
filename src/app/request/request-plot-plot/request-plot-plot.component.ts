import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { PlotTrace } from '../../models/PlotTrace';
import { ThemeService } from '../../services/theme.service';
import { LAYOUTDARK, LAYOUTLIGHT, thresholdShapesDOWN, thresholdShapesUP, thresholdShapesUPDOWN } from '../../wetlab/wetlab-plot/plot.utils'
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { LoginFormComponent } from '../../entry-point/login-form/login-form.component';
declare var Plotly: any;

@Component({
  selector: 'app-request-plot-plot',
  templateUrl: './request-plot-plot.component.html',
  styleUrls: ['./request-plot-plot.component.css']
})
export class RequestPlotPlotComponent implements OnInit {

  @ViewChild("Graph", { static: true })
  private Graph: ElementRef;

  @Input("cs") cs;

  @Input("param") param;

  @Input("requestCode") requestCode;

  randString = '';

  title: string = "";

  // To store the plot data from server
  plotTrace: PlotTrace[];

  // Var to handle the plot layout
  layout: any = {};

  // The current colot schema
  themeColor: string;

  // Subscription to update the plot on theme change
  themeChangesSubscription$: Subscription;

  constructor(private dataService: DataService, private themeService: ThemeService, private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.layout.shapes = [];
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.themeColor = this.themeService.currentTheme;
    this.getData();
    this.subscribeToThemeChanges();
    this.getName();

  }

  ngOnDestroy(): void {
    this.themeChangesSubscription$.unsubscribe();
    Plotly.purge(`Graph${this.randString}`);
  }


  private getData(): void {
    this.dataService.getDataForPlotRequest(this.cs, this.param, this.requestCode).subscribe(
      res => {
        this.plotTrace = res;
        if (this.plotTrace.length !== 0) {
          this.getName();
          this.plotGraph();
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  private getName(): void {
    this.requestService.getRequestPlotName(this.cs, this.param).subscribe(
      res => {
        // this.layout.title = res;
        this.title = res;

      },
      err => {
        console.error(err);
      }
    );
  }

  private plotGraph(): void {
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
    // Check current theme
    if (this.themeColor === 'dark-theme') {
      this.layout = LAYOUTDARK;
    } else if (this.themeColor === 'light-theme') {
      this.layout = LAYOUTLIGHT;
    }
    this.layout.shapes = [];

    Plotly.react(`Graph${this.randString}`, dataForPlot, this.layout);
    setTimeout(() => {  // The timeout is necessary because the PLOT isnt instant
      let plotSVG = document.getElementsByClassName('main-svg')[0];  // the only way because this inst plotly native LUL
      (plotSVG as any).style["border-radius"] = '4px';
    }, 100);
  }

    /**
   * Relayouts the plot
   */
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

    /**
   * Subscribes to theme changes
   */
  private subscribeToThemeChanges(): void {
    this.themeChangesSubscription$ = this.themeService.selectedTheme$.subscribe(
      theme => {
        this.themeColor = theme;
        this.reLayout();
      }
    )
  }

}
