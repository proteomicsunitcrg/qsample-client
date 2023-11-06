import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MiniRequest } from '../models/MiniRequest';

@Injectable({
  providedIn: 'root',
})
export class SessionStorage {
  constructor(private httpClient: HttpClient) {}

  public storeRequests(requests: MiniRequest[]): void {
    let storeRequests = {};
    for (const request of requests) {
      storeRequests[request.lastField] = request;
    }

    let currentCount = 0;
    if (sessionStorage.getItem('requests_count')) {
      currentCount = parseInt(sessionStorage.getItem('requests_count'), 10);
    }

    if (currentCount < requests.length) {
      sessionStorage.setItem('requests_count', requests.length.toString());
      sessionStorage.setItem('requests', JSON.stringify(storeRequests));
    }
  }

  public getRequestsJson(): object {
    let requests = null;
    if (sessionStorage.getItem('requests')) {
      requests = JSON.parse(sessionStorage.getItem('requests'));
    }
    return requests;
  }
}
