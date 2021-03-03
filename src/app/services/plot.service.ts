import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlotService {

  constructor() { }

  public selectedSamples = new Subject<any[]>();

  public selectedChecksum = new Subject<string>();

  caca = 'dawda';

  public sendselectedSamples(list: any[]) {
    this.selectedSamples.next(list);
  }

  public getselectedSamples(): Observable<any> {
    return this.selectedSamples.asObservable();
  }

  public getChecksumFromPlotlyClickEvent(data: any): void {
    const splitted = data.points[0].hovertemplate.split('<br>');
    const checksum = splitted[splitted.length - 1];
    this.sendselectedChecksum(checksum);
  }

  public sendselectedChecksum(checksum: string) {
    this.selectedChecksum.next(checksum);
  }

  public getselectedChecksum(): Observable<string> {
    return this.selectedChecksum.asObservable();
  }
}
