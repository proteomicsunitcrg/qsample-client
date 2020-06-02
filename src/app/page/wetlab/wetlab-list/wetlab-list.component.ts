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

  ngOnInit(): void {
    this.getAllWetlabs();
  }

  private getAllWetlabs() {
    this.wetLabService.getWetlabLists().subscribe(
      res => {
        console.log(res);
        this.WetLabs = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  public navigate(wetLab: WetLab) {
    this.router.navigate(['/application/wetlab', wetLab.apiKey]);

  }

}
