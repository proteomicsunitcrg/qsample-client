import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FavoriteRequest } from '../models/FavoriteRequest';
import { MiniRequest } from '../models/MiniRequest';

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

  public checkIfRequestIsFavByRequestCode(requestCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}/checkByRequestCode/${requestCode}`);
  }

  public getFavRequestByRequestCode(requestCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}/getByRequestCode/${requestCode}`);
  }

  public checkIfRequestIsFav(agendoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}/check/${agendoId}`);
  }

  public getFavRequestByAgendoId(agendoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrefix}/get/${agendoId}`);
  }

  public getFavoriteRequests(): Observable<MiniRequest[]> {
    if ( window['env']['local_requests'] ) {
      return this.http.get<MiniRequest[]>(`${this.apiPrefix}/favLocal`);
    } else {
      return this.http.get<MiniRequest[]>(`${this.apiPrefix}/favAgendo`);
    }
  }

  // action = true means add and action = false means delete
  public setNotify(favRequest: FavoriteRequest, action): Observable<FavoriteRequest> {
    const params = JSON.stringify(favRequest);
    return this.http.post<FavoriteRequest>(`${this.apiPrefix}/notify/${action}`, params, {headers: this.headers});
  }

}
