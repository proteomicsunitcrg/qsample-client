import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { MiniRequest } from '../models/MiniRequest';

@Injectable({
  providedIn: 'root'
})
export class QuantificationService {

  constructor(private http: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/quantification';

  params = new HttpParams();


  public getQuantificationByFileChecksumAndContaminant(checksum: string, contaminant: boolean): Observable<any> {
    this.params = this.params.set('contaminant', String(contaminant));
    return this.http.get<any>(`${this.apiPrefix}/getByChecksum/${checksum}`, { params: this.params });
  }

  public getHeatMap(requestCode: string, listOfChecksums: string[], consensus: number, order: string): Observable<any> {
    this.params = new HttpParams();
    listOfChecksums.forEach((item) => {
      this.params = this.params.append(`checksums[]`, item);
    });
    this.params = this.params.set('consensus', consensus.toString());
    this.params = this.params.set('order', order);
    return this.http.get<any>(`${this.apiPrefix}/heatMap/${requestCode}`, { params: this.params });
  }

  public getPCA(requestCode: string, listOfChecksums: string[]): Observable<any> {
    this.params = new HttpParams();
    listOfChecksums.forEach((item) => {
      this.params = this.params.append(`checksums[]`, item);
    });

    return this.http.get<any>(`${this.apiPrefix}/PCA/${requestCode}`, {params: this.params});
  }

  public getDendogram(requestCode: string, listOfChecksums: string[], consensus: number, themeColor: string): Observable<Blob> {
    this.params = new HttpParams();
    listOfChecksums.forEach((item) => {
      this.params = this.params.append(`checksums[]`, item);
    });
    this.params = this.params.set('consensus', consensus.toString());
    this.params = this.params.append('theme', themeColor);
    return this.http.get<Blob>(`${this.apiPrefix}/dendogram/${requestCode}`, {params: this.params, responseType: 'blob' as 'json'});

  }

  public getIsNeonStatsEnabled(): Observable <any> {
    return this.http.get<any>(`${this.apiPrefix}/showNeonStats`);
  }

}
