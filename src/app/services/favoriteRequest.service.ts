import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { MiniRequest } from '../models/MiniRequest';
import { FavoriteRequest } from '../models/FavoriteRequest';

@Injectable({
  providedIn: 'root'
})
export class FavoriteRequestService {

  constructor(private http: HttpClient) { }

  apiPrefix: string = environment.apiPrefix + 'api/favRequest';

  params = new HttpParams();

  headers = new HttpHeaders().set('Content-type', 'application/json');


  public setFavRequest(favRequest: FavoriteRequest): Observable<FavoriteRequest> {
    const params = JSON.stringify(favRequest);
    return this.http.post<FavoriteRequest>(`${this.apiPrefix}/setNew`, params, {headers: this.headers});
  }

  public deleteFavRequest(favRequest: FavoriteRequest): Observable<any> {
    const params = JSON.stringify(favRequest);
    return this.http.post<any>(`${this.apiPrefix}/removeFav`, params, {headers: this.headers});
  }

  public checkIfRequestIsFav(agendoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}/check/${agendoId}`);
  }

  public getFavoriteRequestsAgendo(): Observable<MiniRequest[]> {
    return this.http.get<MiniRequest[]>(`${this.apiPrefix}/favAgendo`);
  }

}
