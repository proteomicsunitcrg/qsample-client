import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlotService {

  constructor() { }

  public selectedSamples = new Subject<any[]>();

  public sendselectedSamples(list: any[]) {
    this.selectedSamples.next(list);
  }

  public getselectedSamples(): Observable<any> {
    return this.selectedSamples.asObservable();
  }
}
