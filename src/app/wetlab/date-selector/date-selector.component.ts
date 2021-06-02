import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../services/data.service';

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
  dateStart = new FormControl(new Date(this.lastMonth.setMonth(this.today.getMonth() - 1)));
  dateEnd = new FormControl(new Date(this.today));

  ngOnInit(): void {
    this.setDefaultDates();
    this.submitDates();
  }

  private setDefaultDates(): void {
    let weekControl = document.getElementsByClassName('week');
    for (let week of weekControl) {
      week.setAttribute('value', `${this.todayYear}-W${this.fourWeeksAgo}`);
    }
  }


  public submitDates(): void {
    if (this.weekPickerStart == null || this.weekPickerEnd == null) {
      this.dataService.selectDates([this.dateStart.value.toISOString(), this.dateEnd.value.toISOString()]);
    } else {
      this.getDateOfISOWeek(this.weekPickerStart.split('-')[1].substring(1), this.weekPickerStart.split('-')[0]);
      this.getLastWeekDateByDate(this.getDateOfISOWeek(this.weekPickerStart.split('-')[1].substring(1), this.weekPickerStart.split('-')[0]));

      this.dataService.selectDates([this.getDateOfISOWeek(this.weekPickerStart.split('-')[1].substring(1), this.weekPickerStart.split('-')[0]).toISOString(),
      this.getLastWeekDateByDate(this.getDateOfISOWeek(this.weekPickerEnd.split('-')[1].substring(1), this.weekPickerEnd.split('-')[0])).toISOString()]);
    }
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

