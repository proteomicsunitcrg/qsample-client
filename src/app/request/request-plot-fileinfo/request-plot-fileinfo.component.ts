import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../app/services/theme.service';
import { WetLabFile } from '../../../app/models/WetLabFile';
import { FileService } from '../../../app/services/file.service';
import { LAYOUTDARKOVERLAY, LAYOUTLIGHTOVERLAY } from '../../wetlab/wetlab-plot/plot.utils';
import { PlotService } from '../../../app/services/plot.service';
import { RequestFile } from 'src/app/models/RequestFile';

declare var Plotly: any;

@Component({
  selector: 'app-request-plot-fileinfo',
  templateUrl: './request-plot-fileinfo.component.html',
  styleUrls: ['./request-plot-fileinfo.component.css']
})
export class RequestPlotFileinfoComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('requestCode') requestCode: string;

  allFiles: RequestFile[];

  randString = '';

  // The current colot schema
  themeColor: string;

  // Subscription to update the plot on list change
  fileListChangesSubscription$: Subscription;

  // Subscription to update the plot on theme change
  themeChangesSubscription$: Subscription;

  // Subscription to know the order
  orderSubscription$: Subscription;

  order: string;

  // Var to handle the plot layout
  layout: any = {};

  // Flag to know if the plot has data
  noDataFound = false;

  // Message error
  msgError = '';

  selectedSamples = [];

  constructor(private fileService: FileService, private themeService: ThemeService, private plotService: PlotService) { }

  ngOnInit(): void {
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.themeColor = this.themeService.currentTheme;
    this.subscribeToThemeChanges();
    this.subscribeToOrder();
    this.subscribeToListChanges();
    this.getData();
  }

  ngOnDestroy(): void {
    this.themeChangesSubscription$.unsubscribe();
    this.orderSubscription$.unsubscribe();
    this.fileListChangesSubscription$.unsubscribe();
  }

  private getData(): void {
    this.fileService.getFilesByRequestCode(this.requestCode, this.order).subscribe(
      res => {
        if (res.length === 0) {
          this.noDataFound = true;
        } else {
          this.allFiles = res;
          this.plotGraph();
          this.noDataFound = false;
        }
      },
      err => {
        this.noDataFound = true;
        this.msgError = 'Nothing found';
        console.error(err);
      }
    );
  }

  private plotGraph(): void {
    const filenames: string[] = [];
    const valuesPeptideHits: number[] = [];
    const valuesPeptideModified: number[] = [];
    if (!this.allFiles) {
      return;
    }
    this.allFiles.forEach(
      file => {
        if (file.fileInfo) {
          if (this.checkFileInList(file)) {
            valuesPeptideHits.push(file.fileInfo.peptideHits);
            valuesPeptideModified.push(file.fileInfo.peptideModified);
            filenames.push(file.filename);
          }
        }
      }
    );
    const tracePeptideHits = {
      x: filenames,
      y: valuesPeptideHits,
      type: 'bar',
      name: 'Peptide hits',
      filenames
    };
    const tracePeptideModified = {
      x: filenames,
      y: valuesPeptideModified,
      type: 'bar',
      name: 'Peptides modified',
      filenames
    };
    // Check current theme
    if (this.themeColor === 'dark-theme') {
      this.layout = LAYOUTDARKOVERLAY;
    } else if (this.themeColor === 'light-theme') {
      this.layout = LAYOUTLIGHTOVERLAY;
    } else {
      this.layout = LAYOUTLIGHTOVERLAY;
    }
    const config = { responsive: true };
    Plotly.react(`Graph${this.randString}`, [tracePeptideHits, tracePeptideModified], this.layout, config);
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


  private subscribeToOrder(): void {
    this.orderSubscription$ = this.plotService.selectedOrder.subscribe(
      order => {
        this.order = order;
        this.getData();
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

  private checkFileInList(file: any): boolean {
    for (const item of this.selectedSamples) {
      if (item.checksum === file.checksum) {
        return true;
      }
    }
    return false;
  }


}
