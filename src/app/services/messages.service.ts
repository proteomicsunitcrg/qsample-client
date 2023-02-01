import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private httpClient: HttpClient) { }

  public getMessages() {


    return this.httpClient.get(`assets/messages.json`);

  }


}
