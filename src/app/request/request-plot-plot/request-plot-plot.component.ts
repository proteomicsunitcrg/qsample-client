import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { PlotTrace } from '../../models/PlotTrace';
import { ThemeService } from '../../services/theme.service';
import { LAYOUTDARK, LAYOUTLIGHT } from '../../wetlab/wetlab-plot/plot.utils';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { LoginFormComponent } from '../../entry-point/login-form/login-form.component';
import { PlotService } from '../../services/plot.service';
import { ApplicationService } from '../../services/application.service';
declare var Plotly: any;

@Component({
  selector: 'app-request-plot-plot',
  templateUrl: './request-plot-plot.component.html',
  styleUrls: ['./request-plot-plot.component.css']
})
export class RequestPlotPlotComponent implements OnInit, OnDestroy, AfterViewInit {

  // tslint:disable-next-line:no-input-rename
  @ViewChild('Graph', { static: true })
  private Graph: ElementRef;

  // tslint:disable-next-line:no-input-rename
  @Input('cs') cs;

  // tslint:disable-next-line:no-input-rename
  @Input('param') param;

  // tslint:disable-next-line:no-input-rename
  @Input('requestCode') requestCode;

  // tslint:disable-next-line:no-input-rename
  @Input('name') name;

  // tslint:disable-next-line:no-input-rename
  @Input('tooltip') tooltip;

  randString = '';

  // Title of the component
  title = '';

  // Help element
  help = '';

  // To store the plot data from server
  plotTrace: PlotTrace[];

  // Var to handle the plot layout
  layout: any = {};

  // The current colot schema
  themeColor: string;

  // Subscription to update the plot on theme change
  themeChangesSubscription$: Subscription;

  // Subscription to update the plot on list change
  fileListChangesSubscription$: Subscription;

  // Subscription to know the order
  orderSubscription$: Subscription;

  order: string;


  // Flag to know if the plot has data
  noDataFound = false;

  // Message error
  msgError = '';

  selectedSamples = [];

  plotElement;

  counter = 0;


  constructor(private dataService: DataService, private themeService: ThemeService, private requestService: RequestService,
    private plotService: PlotService, private applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    console.log(this.cs);
    this.layout.shapes = [];
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.themeColor = this.themeService.currentTheme;
    this.subscribeToOrder(); // this method retrieves the data
    this.subscribeToThemeChanges();
    this.subscribeToListChanges();
    this.title = this.name
    this.help = this.applicationService.getAppMessage( this.tooltip );

  }

  ngOnDestroy(): void {
    this.themeChangesSubscription$.unsubscribe();
    this.fileListChangesSubscription$.unsubscribe();
    this.orderSubscription$.unsubscribe();
    Plotly.purge(`Graph${this.randString}`);
  }

  ngAfterViewInit(): void {
    this.plotElement = document.getElementById('Graph' + this.randString) as any;
  }


  private getData(): void {
    // console.log( "DAAALE");
    // console.log(this.requestCode);
    this.dataService.getDataForPlotRequest(this.cs, this.param, this.requestCode, this.order).subscribe(
      res => {
        this.plotTrace = res;

        if (this.plotTrace.length !== 0) {
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

  // Two initial parts of the filename are removed
  private parseFilename(filename: string): string {

    let fileParts = filename.split('_');
    fileParts.shift();
    fileParts.shift(); 
    filename = fileParts.join('_');
    return filename;
  }

  private plotGraph(): void {
    const dataForPlot = [];
    if (this.plotTrace === undefined) {
      return;
    }
    this.plotTrace.forEach(
      plotTrace => {
        const values = [];
        const filenames = [];
        const dates = [];
        const color = [];
        const checksum = [];
        plotTrace.plotTracePoints.forEach(
          plotTracePoint => {
            if (this.checkFileInList(plotTracePoint.file)) {
              values.push(plotTracePoint.value);
              filenames.push(this.parseFilename(plotTracePoint.file.filename));
              dates.push(plotTracePoint.file.creationDate);
              color.push('red');
              checksum.push(`${plotTracePoint.file.filename}<br>${plotTracePoint.value}<br>${plotTracePoint.file.creation_date}<br>${plotTracePoint.file.checksum}`);
            }
          }
        );
        const trace = {
          x: filenames,
          y: values,
          type: 'bar',
          name: plotTrace.abbreviated,
          filenames,
          checksum,
          hovertemplate: checksum
        };
        dataForPlot.push(trace);
      }
    );
    // Check current theme
    if (this.themeColor === 'dark-theme') {
      this.layout = LAYOUTDARK;
    } else if (this.themeColor === 'light-theme') {
      this.layout = LAYOUTLIGHT;
    } else {
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
    if (this.counter === 0) { // Only link the listener the first time the plot is created
      const plot = document.getElementById('Graph' + this.randString) as any;
      plot.on('plotly_click', (data) => {
        this.plotService.getChecksumFromPlotlyClickEvent(data);
      });
    }
    this.counter++;

  }

  /**
  * Relayouts the plot
  */
  private reLayout(): void {
    console.log("RELAYOUT");
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

  /**
  * Subscribes to list display changes
  */
  private subscribeToListChanges(): void {
    this.fileListChangesSubscription$ = this.plotService.selectedSamples.subscribe(
      list => {
        this.selectedSamples = list;
        this.plotGraph();
      }
    );
  }

  private subscribeToOrder(): void {
    this.orderSubscription$ = this.plotService.selectedOrder.subscribe(
      order => {
        this.order = order;
        this.getData();
      }
    );
  }

  private checkFileInList(file: any): boolean {
    for (const item of this.selectedSamples) {
      if (item.checksum === file.checksum) {
        return true;
      }
    }
    return false;
  }

}
