import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../services/messages.service'
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
  title: string;

  ngOnInit(): void {

    // this.title = window['env']['general-wetlab-home']; #TODO: Migrate
    this.title = 'Sample preparation QC';
    this.additional = '';
    // if ( ! window['env']['local_requests']  ) { # TODO: Migrate
    if ( this.wetLabService.apiPrefix.includes('qsample.crg.eu') ) {
      this.additional = '(New 30 min gradient starting from 14/02/2022)';
      // this.title = window['env']['general-wetlab-production']; #TODO: Migrate
      this.title = 'Wetlab';
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
