import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { WetLab } from '../../models/WetLab';
import { PlotTrace } from '../../models/PlotTrace';
import { Subscription } from 'rxjs';
import { ThemeSelectorComponent } from '../../page/top-bar/theme-selector/theme-selector.component';
import { ThemeService } from 'src/app/services/theme.service';
import { LAYOUTDARK, LAYOUTLIGHT } from './plot.utils'
declare var Plotly: any;

@Component({
  selector: 'app-wetlab-plot',
  templateUrl: './wetlab-plot.component.html',
  styleUrls: ['./wetlab-plot.component.css']
})
export class WetlabPlotComponent implements OnInit {

  constructor(private dataService: DataService, private themeService: ThemeService) { }

  @ViewChild("Graph", { static: true })
  private Graph: ElementRef;

  @Input("plot") plot;

  @Input("wetlab") wetlab: WetLab;

  layout: any;

  dateChangesSubscription$: Subscription;

  themeChangesSubscription$: Subscription;

  themeColor: string;

  currentDates: Date[];

  randString = '';

  noDataFound = false;


  ngOnInit(): void {
    this.themeColor = this.themeService.currentTheme;
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log(this.randString);
    this.getData();
    this.subscribeToDateChanges();
    this.subscribeToThemeChanges();
  }

  plotTrace: PlotTrace[];

  private getData(): void {
    this.dataService.getDataForPlot(this.plot.id, this.wetlab.apiKey).subscribe(
      res => {
        this.plotTrace = res;
        if (this.plotTrace.length !== 0) { // Check the server have returned data
          this.plotGraph();
          this.noDataFound = false;
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
    if (this.themeColor === 'dark-theme') {
      this.layout = LAYOUTDARK;
    } else if (this.themeColor === 'light-theme') {
      this.layout = LAYOUTLIGHT;
    }
    this.layout.title = this.plot.name;

    let layout = { barmode: 'group' };

    this.Graph = Plotly.react(`Graph${this.randString}`, dataForPlot, this.layout);
    setTimeout(() => {  // The timeout is necessary because the PLOT isnt instant
      let plotSVG = document.getElementsByClassName('main-svg')[0];  // the only way because this inst plotly native LUL
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

  private subscribeToThemeChanges(): void {
    this.themeChangesSubscription$ = this.themeService.selectedTheme$.subscribe(
      theme => {
        this.themeColor = theme;
        this.getData();
      }
    )
  }

}
