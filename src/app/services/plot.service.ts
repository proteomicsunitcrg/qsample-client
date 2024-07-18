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
    // We retrieve checksum from customdata Plotly attribute
    const checksum = data.points[0].customdata;
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
