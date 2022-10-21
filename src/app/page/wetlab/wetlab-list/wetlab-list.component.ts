import { Component, OnInit } from '@angular/core';
import { WetLab } from '../../../models/WetLab';
import { WetLabService } from '../../../services/wetlab.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wetlab-list',
  templateUrl: './wetlab-list.component.html',
  styleUrls: ['./wetlab-list.component.css']
})
export class WetlabListComponent implements OnInit {

  constructor(private wetLabService: WetLabService, private router: Router) { }

  WetLabs: WetLab[];
  additional: string;

  ngOnInit(): void {

    this.additional = '';
    // TODO: This should be changed to something cleaner
    if ( this.wetLabService.apiPrefix.includes('qsample.crg.eu')  ) {
      this.additional = '(New 30 min gradient starting from 14/02/2022)';
    }

    this.getAllWetlabs();
  }

  private getAllWetlabs() {
    this.wetLabService.getWetlabLists().subscribe(
      res => {
        this.WetLabs = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  public navigate(wetLab: WetLab) {
    this.router.navigate(['/wetlab/plot', wetLab.apiKey]);
  }

  public navigateToGuideset() {
    this.router.navigate(['/wetlab/guideset']);
  }

}
