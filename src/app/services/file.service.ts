import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WetLab } from '../models/WetLab';
import { File } from '../models/File';
import { QCloud2File } from '../models/QCloud2File';
import { RequestFile } from '../models/RequestFile';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/file/';

  params = new HttpParams();

  public getWetlabLists(): Observable<WetLab> {
    return this.httpClient.get<WetLab>(`${this.apiPrefix}getAllWetlabsType`);
  }

  public getWetLabFilesByWetLabApiKey(apiKey: string): Observable<File[]> {
    return this.httpClient.get<File[]>(`${this.apiPrefix}wetLabFiles/${apiKey}`);
  }

  public getQCloud2Files(requestCode: string): Observable<QCloud2File[]> {
    return this.httpClient.get<QCloud2File[]>(`${this.apiPrefix}qcloud2/${requestCode}`);
  }

  public getFilesByRequestCode(requestCode: string, order: string): Observable<RequestFile[]> {
    this.params = this.params.set('order', order);
    return this.httpClient.get<RequestFile[]>(`${this.apiPrefix}getByRequestCode/${requestCode}`, {params: this.params});
  }

  public getRequestFileByChecksum(checksum: string): Observable<RequestFile> {
    return this.httpClient.get<RequestFile>(`${this.apiPrefix}getRequestFileByChecksum/${checksum}`);
  }


}
