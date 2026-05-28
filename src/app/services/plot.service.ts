import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlotService {

  constructor() { }

  public selectedSamples = new Subject<any[]>();

  public selectedChecksum = new Subject<string>();

  public selectedOrder = new BehaviorSubject<string>('filename');


  public sendselectedSamples(list: any[]) {
    this.selectedSamples.next(list);
  }

  public getselectedSamples(): Observable<any> {
    return this.selectedSamples.asObservable();
  }

  public getChecksumFromPlotlyClickEvent(data: any): void {
    if (!data || !data.points || data.points.length === 0) {
      return;
    }

    const point = data.points[0];

    let customdata = point.customdata;

    if (!customdata && point.data && point.data.customdata) {
      const pointIndex = point.pointIndex !== undefined ? point.pointIndex : point.pointNumber;
      customdata = point.data.customdata[pointIndex];
    }

    const checksum = Array.isArray(customdata)
      ? customdata[0]
      : customdata;

    if (!checksum) {
      return;
    }
    this.sendselectedChecksum(checksum);
  }

  public sendselectedChecksum(checksum: string) {
    this.selectedChecksum.next(checksum);
  }

  public getselectedChecksum(): Observable<string> {
    return this.selectedChecksum.asObservable();
  }

  public sendselectedOrder(order: string) {
    this.selectedOrder.next(order);
  }

  public getselectedOrder(): Observable<string> {
    return this.selectedOrder.asObservable();
  }
}
