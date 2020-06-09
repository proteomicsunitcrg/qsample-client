import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.css']
})
export class ThemeSelectorComponent implements OnInit {

  // let's define default theme
  themeColor = 'light-theme';

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.setDefaultTheme();
  }


  private setDefaultTheme(): void {
    // if theme is stored in storage - use it
    if (localStorage.getItem('pxTheme')) {
      //set theme color to one from storage
      this.themeColor = localStorage.getItem('pxTheme');
      //add that class to body
      const body = document.getElementsByTagName('body')[0];
      body.classList.add(this.themeColor);
      this.themeService.selectTheme(this.themeColor);
    }
  }

  public themeSwitcher(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove(this.themeColor);
    // switch theme
    (this.themeColor == 'light-theme') ? this.themeColor = 'dark-theme' : this.themeColor = 'light-theme';
    body.classList.add(this.themeColor);
    //save it to local storage
    localStorage.setItem('pxTheme', this.themeColor);
    this.themeService.selectTheme(this.themeColor);
  }

}
