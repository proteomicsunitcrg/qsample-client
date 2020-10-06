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
  lastMonth = new Date(this.today.getTime());
  dateStart = new FormControl(new Date(this.lastMonth.setMonth(this.today.getMonth() - 1)));
  dateEnd = new FormControl(new Date(this.today));

  ngOnInit(): void {
    this.submitDates();
  }


  public submitDates(): void {
    this.dataService.selectDates([this.dateStart.value.toISOString(), this.dateEnd.value.toISOString()]);
  }


}
