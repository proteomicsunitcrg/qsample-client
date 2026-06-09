import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestFile } from '../../../app/models/RequestFile';
import { FileService } from '../../../app/services/file.service';
import { PlotService } from '../../../app/services/plot.service';
import { ThemeService } from '../../../app/services/theme.service';
import {
  LAYOUTDARKGROUP,
  LAYOUTDARKOVERLAY,
  LAYOUTLIGHTGROUP,
  LAYOUTLIGHTOVERLAY,
} from '../../wetlab/wetlab-plot/plot.utils';
import { ApplicationService } from '../../services/application.service';

declare var Plotly: any;

@Component({
  selector: 'app-request-plot-modifications',
  templateUrl: './request-plot-modifications.component.html',
  styleUrls: ['./request-plot-modifications.component.css'],
})
export class RequestPlotModificationsComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('requestCode') requestCode: string;

  // tslint:disable-next-line:no-input-rename
  @Input('type') type: string;

  // tslint:disable-next-line:no-input-rename
  @Input('name') title: string;

  // tslint:disable-next-line:no-input-rename
  @Input('tooltip') tooltip;

  // Subscription to know the order
  orderSubscription$: Subscription;

  order: string;

  // Flag to know if the plot has data
  noDataFound = false;

  // Help element
  help = '';

  // Message error
  msgError = '';

  allFiles: RequestFile[] = [];

  // The current colot schema
  themeColor: string;

  // Subscription to update the plot on theme change
  themeChangesSubscription$: Subscription;

  // Subscription to update the plot on list change
  fileListChangesSubscription$: Subscription;

  // Var to handle the plot layout
  layout: any = {};

  selectedSamples = [];

  randString = '';

  constructor(
    private fileService: FileService,
    private themeService: ThemeService,
    private plotService: PlotService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.randString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.themeColor = this.themeService.currentTheme;
    this.subscribeToThemeChanges();
    this.subscribeToListChanges();
    this.subscribeToOrder();
    this.getData();
    this.help = this.applicationService.getAppMessage(this.tooltip);
  }

  ngOnDestroy(): void {
    this.themeChangesSubscription$.unsubscribe();
    this.fileListChangesSubscription$.unsubscribe();
    this.orderSubscription$.unsubscribe();
  }

  private getData(): void {
    this.allFiles = [];
    this.noDataFound = true;
    this.msgError = 'No data found';

    this.fileService.getFilesByRequestCode(this.requestCode, this.order).subscribe(
      (res) => {
        if (res) {
          for (let file of res) {
            if (file.hasOwnProperty('modificationRelation') && file.modificationRelation.length > 0) {
              for (let rel of file.modificationRelation) {
                if (rel.modification.type == this.type) {
                  this.noDataFound = false;
                  break;
                }
              }
            }
          }
          this.allFiles = res;
          this.plotGraph();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Two initial parts of the filename are removed
  private parseFilename(filename: string): string {
    let fileParts = filename.split('_');
    fileParts.shift();
    fileParts.shift();
    filename = fileParts.join('_');
    filename = filename.replace(/\.raw$/i, "");
    return filename;
  }
  private plotGraph(): void {
    const filenames: string[] = [];
    const valuesPeptideHits: number[] = [];
    const valuesPeptideModified: number[] = [];
    const traces = [];
    if (!this.allFiles) {
      return;
    }
    this.allFiles.forEach((file) => {
    if (this.checkFileInList(file)) {
      filenames.push(this.parseFilename(file.filename));

      traces.forEach(trace => {
        trace.y.push(0);
      });

      const orderedCopy = file.modificationRelation;
      orderedCopy.sort((a, b) => (a.id > b.id ? 1 : -1));

      orderedCopy.forEach((modRel) => {
        if (modRel.modification.type !== this.type) {
          return;
        }

        let found = false;

        for (let mod of traces) {
          if (mod.name === modRel.modification.name) {
            mod.y[filenames.length - 1] = Number(modRel.value.toFixed(2));
            found = true;
          }
        }

        if (!found) {
          const yValues = new Array(filenames.length).fill(0);
          yValues[filenames.length - 1] = Number(modRel.value.toFixed(2));

          traces.push({
            name: modRel.modification.name,
            y: yValues,
            x: filenames,
            type: 'bar',
          });
        }
      });
    }
  });
    // // Check current theme
    if (this.themeColor === 'dark-theme') {
      this.layout = LAYOUTDARKGROUP;
    } else if (this.themeColor === 'light-theme') {
      this.layout = LAYOUTLIGHTGROUP;
    } else {
      this.layout = LAYOUTLIGHTGROUP;
    }
    traces.forEach(trace => {
      trace.x = filenames;
    });

    const config = { responsive: true };
    this.layout = {
      ...this.layout,
      autosize: true,
      width: 900
    };

    Plotly.newPlot(`Graph${this.randString}`, traces, this.layout, config);
    setTimeout(() => {
      // The timeout is necessary because the PLOT isnt instant
      const plotsSVG = document.getElementsByClassName('main-svg'); // the only way because this inst plotly native LUL
      for (const ploterino of plotsSVG as any) {
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
            color: '#FFFFFF',
          },
        };
        break;
      case 'light-theme':
        update = {
          plot_bgcolor: 'white',
          paper_bgcolor: 'white',
          font: {
            color: 'black',
          },
        };
        break;
    }
    this.getData();
  }

  /**
   * Subscribes to theme changes
   */
  private subscribeToThemeChanges(): void {
    this.themeChangesSubscription$ = this.themeService.selectedTheme$.subscribe((theme) => {
      this.themeColor = theme;
      this.reLayout();
    });
  }

  /**
   * Subscribes to list display changes
   */
  private subscribeToListChanges(): void {
    this.fileListChangesSubscription$ = this.plotService.selectedSamples.subscribe((list) => {
      this.selectedSamples = list;
      this.plotGraph();
    });
  }

  private subscribeToOrder(): void {
    this.orderSubscription$ = this.plotService.selectedOrder.subscribe((order) => {
      this.order = order;
      this.getData();
    });
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
