import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { WetLab } from '../models/WetLab';
import { PlotTrace } from '../models/PlotTrace';
import { PlotTraceWetlab } from '../models/PlotTraceWetlab';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix;

  params = new HttpParams();


  private selectedDates = new Subject<String[]>();
  selectedDates$ = this.selectedDates.asObservable();
  currentDates: String[];

  public selectDates(datesArray: String[]): void {
    this.currentDates = datesArray;
    this.selectedDates.next(datesArray);
  }

  public getDataForPlot(plotApiKey: string, wetLabApiKey: string): Observable<PlotTraceWetlab[]> {
    if (this.currentDates === undefined) { // for the plots in request details page
      return this.httpClient.get<PlotTraceWetlab[]>
        (`${this.apiPrefix}api/data/traces/2018-06-07T10:54:50.229Z/2022-06-07T10:54:50.229Z/${plotApiKey}/${wetLabApiKey}`);
    }
    return this.httpClient.get<PlotTraceWetlab[]>
      (`${this.apiPrefix}api/data/traces/${this.currentDates[0]}/${this.currentDates[1]}/${plotApiKey}/${wetLabApiKey}`);
  }


  public getDataForPlotRequest(contextSourceId: number, paramId: number, requestCode: string, order: string): Observable<PlotTrace[]> {
    this.params = this.params.set('order', order);
    return this.httpClient.get<PlotTrace[]>(`${this.apiPrefix}api/data/tracesRequest/${contextSourceId}/${paramId}/${requestCode}`, {params: this.params});
  }

}
