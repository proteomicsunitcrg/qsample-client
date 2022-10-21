import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServerConfig } from '../models/ServerConfig';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix;

  public getConfig(): Observable<ServerConfig[]> {
    return this.httpClient.get<ServerConfig[]>(`${this.apiPrefix}api/config`);
  }


}
