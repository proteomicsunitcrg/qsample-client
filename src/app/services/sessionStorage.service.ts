import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MiniRequest } from '../models/MiniRequest';

@Injectable({
  providedIn: 'root',
})
export class SessionStorage {
  constructor(private httpClient: HttpClient) {}

  public storeRequests(requests: MiniRequest[]): void {
    let storedRequests = {};

    if (sessionStorage.getItem('requests')) {
      storedRequests = JSON.parse(sessionStorage.getItem('requests'));
    }

    for (const request of requests) {
      storedRequests[request.lastField] = request;
    }

    sessionStorage.setItem('requests', JSON.stringify(storedRequests));
    sessionStorage.setItem('requests_count', Object.keys(storedRequests).length.toString());
  }

  public getRequestsJson(): object {
    let requests = null;

    if (sessionStorage.getItem('requests')) {
      requests = JSON.parse(sessionStorage.getItem('requests'));
    }

    return requests;
  }
}