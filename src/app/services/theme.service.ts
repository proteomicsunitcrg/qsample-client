import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private httpClient: HttpClient) { }

  apiPrefix: string = environment.apiPrefix;

  private selectedTheme = new Subject<string>();
  selectedTheme$ = this.selectedTheme.asObservable();
  currentTheme: string;

  public selectTheme(theme: string): void {
    this.currentTheme = theme;
    this.selectedTheme.next(this.currentTheme);
  }

}
