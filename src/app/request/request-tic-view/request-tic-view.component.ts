import { Component, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { FileService } from '../../services/file.service';

declare var Plotly: any;

/**
 * Dedicated "Total Ion Current view" for a request (QCloud2-style).
 *
 * A collapsed panel at the top of the request charts. When the user opens it,
 * the full TIC curve of the last file of the request is fetched by checksum and
 * plotted (decimated, base peak = 100). Selecting a different file in the
 * dropdown successively loads that file's TIC.
 *
 * The series is fetched lazily (only when opened / when a file is chosen) and
 * the plot is purged on close, so the page never loads the (up to 100k+)
 * series points upfront. The server returns the decoded JSON
 * ([[rt_ms, msLevel, tic], ...]) as plain text, so no client-side gunzip is
 * needed (unlike QCloud2's gz1: blob).
 */
@Component({
  selector: 'app-request-tic-view',
  templateUrl: './request-tic-view.component.html',
  styleUrls: ['./request-tic-view.component.css'],
})
export class RequestTicViewComponent implements OnDestroy {

  @Input() requestCode: string;

  @ViewChild('ticPlot', { static: false }) private ticPlotRef: ElementRef;

  files: any[] = [];
  selectedFile: any = null;
  selectedChecksum: string = null;

  isExpanded = false;
  loading = false;

  /** null | 'nofile' | 'notfound' | 'decode' | 'http' */
  error: string = null;

  series: number[][] = null;
  private filesLoaded = false;

  constructor(private fileService: FileService) { }

  onPanelChanged(expanded: boolean): void {
    this.isExpanded = expanded;
    if (expanded) {
      this.ensureFilesLoaded();
    } else {
      this.cleanupPlot();
    }
  }

  onFileSelected(checksum: string): void {
    const file = this.files.find((f) => f.checksum === checksum);
    if (!file) {
      return;
    }
    this.selectedFile = file;
    this.selectedChecksum = checksum;
    if (this.isExpanded) {
      this.loadTic();
    }
  }

  private ensureFilesLoaded(): void {
    if (this.filesLoaded) {
      this.loadTic();
      return;
    }
    this.loading = true;
    this.error = null;
    this.fileService.getFilesByRequestCode(this.requestCode, 'date').subscribe(
      (res) => {
        this.files = res || [];
        this.filesLoaded = true;
        this.loading = false;
        if (this.selectedChecksum === null && this.files.length > 0) {
          // Default selection: the last file of the request.
          this.selectedFile = this.files[this.files.length - 1];
          this.selectedChecksum = this.selectedFile.checksum;
        }
        this.loadTic();
      },
      (err) => {
        console.error('[TIC] failed to load files', err);
        this.loading = false;
        this.error = 'http';
      }
    );
  }

  private loadTic(): void {
    this.cleanupPlot();
    this.error = null;
    if (!this.selectedFile || !this.selectedFile.checksum) {
      this.error = 'nofile';
      return;
    }
    this.loading = true;
    const checksum = this.selectedFile.checksum;
    this.fileService.getTicByChecksum(checksum).subscribe(
      (raw: string) => {
        if (!this.selectedFile || this.selectedFile.checksum !== checksum) {
          return; // a newer file was selected meanwhile
        }
        this.loading = false;
        try {
          this.series = this.decodeTic(raw);
        } catch (e) {
          this.series = null;
          this.error = 'decode';
          return;
        }
        // Wait for the *ngIf to render the plot div before Plotly.react.
        setTimeout(() => {
          if (this.series !== null) {
            this.renderPlot();
          }
        }, 0);
      },
      (err) => {
        console.error('[TIC] ERR', { status: err && err.status, url: err && err.url });
        this.series = null;
        this.loading = false;
        this.error = (err && err.status === 404) ? 'notfound' : 'http';
      }
    );
  }

  /** Decodes the stored (decoded) TIC series: JSON [[rt_ms, msLevel, tic], ...]. */
  private decodeTic(raw: string): number[][] {
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      throw new Error('unexpected TIC format');
    }
    const pts = JSON.parse(raw);
    if (!Array.isArray(pts)) {
      throw new Error('unexpected TIC payload');
    }
    return pts;
  }

  /**
   * Min/max per bucket decimation: keeps the visible peaks (what matters for a
   * TIC eyeball check) while capping the plotted point count.
   */
  private decimateForDisplay(pts: number[][], target: number): number[][] {
    if (pts.length <= target) {
      return pts;
    }
    const out: number[][] = [];
    const bucket = pts.length / target;
    for (let i = 0; i < target; i++) {
      const start = Math.floor(i * bucket);
      const end = Math.min(pts.length, Math.floor((i + 1) * bucket));
      if (start >= end) {
        continue;
      }
      let min = pts[start];
      let max = pts[start];
      for (let j = start + 1; j < end; j++) {
        if (pts[j][2] < min[2]) {
          min = pts[j];
        }
        if (pts[j][2] > max[2]) {
          max = pts[j];
        }
      }
      out.push(min, max);
    }
    return out;
  }

  private renderPlot(): void {
    if (!this.ticPlotRef || !this.ticPlotRef.nativeElement) {
      return;
    }
    const pts = this.decimateForDisplay(this.series, 4000);
    let maxTic = 0;
    for (const p of pts) {
      if (p[2] > maxTic) {
        maxTic = p[2];
      }
    }
    const x: number[] = [];
    const y: number[] = [];
    for (const p of pts) {
      x.push(p[0] / 60000); // rt ms -> min
      y.push(maxTic > 0 ? p[2] / maxTic * 100 : 0); // relative abundance, base peak = 100
    }
    const trace = {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines',
      line: { width: 1 },
      name: 'TIC'
    };
    const layout = {
      title: { text: 'Total Ion Current - ' + (this.selectedFile.filename || this.selectedFile.checksum) },
      xaxis: { title: { text: 'Time (min)' } },
      yaxis: { type: 'linear', range: [0, 100], title: { text: 'Relative abundance' } },
      margin: { l: 70, r: 20, t: 40, b: 45 },
      hovermode: 'x unified'
    };
    Plotly.react(this.ticPlotRef.nativeElement, [trace], layout, { responsive: true });
  }

  private cleanupPlot(): void {
    if (this.ticPlotRef && this.ticPlotRef.nativeElement) {
      Plotly.purge(this.ticPlotRef.nativeElement);
    }
    this.series = null;
  }

  ngOnDestroy(): void {
    this.cleanupPlot();
  }
}
