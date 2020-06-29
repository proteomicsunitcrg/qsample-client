import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { ContextSource } from '../models/contextSource';
import { Threshold } from '../models/Threshold';
import { ThresholdForPlot } from '../models/ThresholdForPlot';

@Injectable()
export class ThresholdService {

  constructor(private httpClient: HttpClient) { }

  private apiPrefix = environment.apiPrefix;
  private thresholdUrl = this.apiPrefix + 'api/threshold';

  public getThresholdForPlot(chartApiKey: string, wetlabApiKey: string): Observable<ThresholdForPlot> {
    return this.httpClient.get<ThresholdForPlot>(`${this.thresholdUrl}/plot/${chartApiKey}/${wetlabApiKey}`);
  }

}
