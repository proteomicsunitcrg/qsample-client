import { Component, OnInit } from '@angular/core';
import { WetLabService } from '../../services/wetlab.service';
import { WetLab } from '../../models/WetLab';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-request-wetlab-main',
  templateUrl: './request-wetlab-main.component.html',
  styleUrls: ['./request-wetlab-main.component.css']
})
export class RequestWetlabMainComponent implements OnInit {

  constructor(private wetLabService: WetLabService, private dataService: DataService) { }

  allWetlabs: WetLab[];

  ngOnInit(): void {
    this.dataService.currentDates = undefined;
    this.getAllWetLab();
  }



  private getAllWetLab(): void {
    this.wetLabService.getWetlabLists().subscribe(
      res => {
        this.allWetlabs = res;
      },
      err => {
        console.error(err);
      }
    );
  }

}
