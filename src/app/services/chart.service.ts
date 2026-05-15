import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ChartConfig } from '../models/chart-config.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private apiUrl = '/api/charts';

  constructor(private http: HttpClient) { }

  getChartsByPage(pageName: string): Observable<ChartConfig[]> {
    return this.http.get<ChartConfig[]>(
      `${this.apiUrl}/page/${pageName}`
    );
  }
}
