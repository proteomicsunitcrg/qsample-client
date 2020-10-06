import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { PlotTrace } from '../../models/PlotTrace';
import { ThemeService } from '../../services/theme.service';
import { LAYOUTDARK, LAYOUTLIGHT } from '../../wetlab/wetlab-plot/plot.utils';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { LoginFormComponent } from '../../entry-point/login-form/login-form.component';
declare var Plotly: any;

@Component({
  selector: 'app-request-plot-plot',
  templateUrl: './request-plot-plot.component.html',
  styleUrls: ['./request-plot-plot.component.css']
})
export class RequestPlotPlotComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @ViewChild('Graph', { static: true })
  private Graph: ElementRef;

  // tslint:disable-next-line:no-input-rename
  @Input('cs') cs;

  // tslint:disable-next-line:no-input-rename
  @Input('param') param;

  // tslint:disable-next-line:no-input-rename
  @Input('requestCode') requestCode;

  randString = '';

  title = '';

  // To store the plot data from server
  plotTrace: PlotTrace[];

  // Var to handle the plot layout
  layout: any = {};

  // The current colot schema
  themeColor: string;

  // Subscription to update the plot on theme change
  themeChangesSubscription$: Subscription;

  // Flag to know if the plot has data
  noDataFound = false;

  // Message error
  msgError = '';


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
        console.log(this.plotTrace.length);

        if (this.plotTrace.length !== 0) {
          this.getName();
          this.plotGraph();
          this.noDataFound = false;
        }
      },
      err => {
        this.noDataFound = true;
        this.msgError = err.error.message;
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
          x: filenames,
          y: values,
          type: 'bar',
          name: plotTrace.abbreviated,
          filenames,
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
    this.layout.shapes = [];
    this.layout.title = '';
    const config = { responsive: true };
    Plotly.react(`Graph${this.randString}`, dataForPlot, this.layout, config);
    setTimeout(() => {  // The timeout is necessary because the PLOT isnt instant
      const plotsSVG = document.getElementsByClassName('main-svg');  // the only way because this inst plotly native LUL
      for (const ploterino of (plotsSVG as any)) {
        ploterino.style['border-radius'] = '4px';
      }
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

}
