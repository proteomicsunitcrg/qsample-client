import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestFileStatus } from '../models/RequestFileStatus';

@Injectable({
  providedIn: 'root'
})
export class RequestFileStatusService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/requestFileStatus/';

  public getByRequestCode(requestCode: string): Observable<{ [checksum: string]: RequestFileStatus }> {
    return this.httpClient.get<{ [checksum: string]: RequestFileStatus }>(`${this.apiPrefix}byRequestCode/${requestCode}`);
  }

}
