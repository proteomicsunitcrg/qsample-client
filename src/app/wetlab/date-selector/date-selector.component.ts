import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { getNavigator } from '../wetlab-plot/plot.utils';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit {

  constructor(private dataService: DataService) { }
  today = new Date();
  todayYear = this.today.getFullYear();
  onejan = new Date(this.today.getFullYear(), 0, 1);
  todayWeek = Math.round((((this.today.getTime() - this.onejan.getTime()) / 86400000) + this.onejan.getDay() + 1) / 7) - 1;
  fourWeeksAgo = this.todayWeek - 4;
  weekPickerStart: string;
  weekPickerEnd: string;

  lastMonth = new Date(this.today.getTime());
  // We set the dateStart to 1 year ago
  dateStart = new FormControl(new Date(this.lastMonth.setMonth(this.today.getMonth() - 12)));
  dateEnd = new FormControl(new Date(this.today));

  // true if the navigator supports the input week
  supportsWeekInput: boolean;


  // FROM HERE VARS TO HANDLE THE ALTER SELECTOR
  // array to store all the weeks from 1 to 52
  allWeeks = [];

  // array to store all supported years
  allYears = [];

  weekStartAlter: number;
  weekEndAlter: number;
  yearStartAlter: number;
  yearEndAlter: number;


  ngOnInit(): void {
    this.supportsWeekInput = this.handleBrowser(getNavigator());
    this.allWeeks = Array.from(Array(53).keys()) // yes, I know some years have 53 weeks
    this.allWeeks.shift(); // remove the firts element 0
    this.allYears = this.setAllYears();
    this.setDefaultDates();
    this.submitDates();
  }

  /**
   * 
   * @param navigator returns false if the navigator
   * doesnt supports input type week
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week
   */
  private handleBrowser(navigator: string): boolean {
    switch (navigator) {
      case `Mozilla Firefox`:
      case `Apple Safari`:
      case `unknown`:
      case `Microsoft Internet Explorer`:
      case `Microsoft Edge (Legacy)`:
        return false
      default:
        return true
    }
  }

  private setDefaultDates(): void {
    this.weekStartAlter = this.todayWeek;
    this.yearStartAlter = this.todayYear - 1;
    this.weekEndAlter = this.todayWeek;
    this.yearEndAlter = this.todayYear;
  }

  // This is hardcoded for 5 years
  private setAllYears(): number[] {
    let years = [];
    let currentYear = new Date().getFullYear()
    for (let i = currentYear -5 ; i <= currentYear; i++) {
      years.push(i);
    }
    return years;

  }

  public submitDates(): void {
    if (this.weekPickerStart == null || this.weekPickerEnd == null) {
      this.dataService.selectDates([this.dateStart.value.toISOString(), this.dateEnd.value.toISOString()]);
    } else {
      this.dataService.selectDates([this.getDateOfISOWeek(this.weekPickerStart.split('-')[1].substring(1), this.weekPickerStart.split('-')[0]).toISOString(),
      this.getLastWeekDateByDate(this.getDateOfISOWeek(this.weekPickerEnd.split('-')[1].substring(1), this.weekPickerEnd.split('-')[0])).toISOString()]);
    }
  }

  /**
   * Method to handle the alter selector
   */
  public submitDatesAlter(): void {
    this.dataService.selectDates([this.getDateOfISOWeek(this.weekStartAlter, this.yearStartAlter).toISOString(), this.getDateOfISOWeek(this.weekEndAlter, this.yearEndAlter).toISOString()])
  }

  getDateOfISOWeek(w, y): Date {
    let simple = new Date(y, 0, 1 + (w - 1) * 7);
    let dow = simple.getDay();
    let ISOweekStart = simple;
    if (dow <= 4) {
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    }
    else {
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    return ISOweekStart;
  }

  private getLastWeekDateByDate(date: Date): Date {
    var lastday = date.getDate() - (date.getDay() - 1) + 6;
    let lastDayDate = new Date(date)
    lastDayDate.setDate(lastday);
    return lastDayDate;
  }


}

