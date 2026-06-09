import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WetLab } from '../../models/WetLab';
import { WetLabCategory } from '../../models/WetLabCategory';
import { WetLabService } from '../../services/wetlab.service';

@Component({
  selector: 'app-wetlab-main',
  templateUrl: './wetlab-main.component.html',
  styleUrls: ['./wetlab-main.component.css']
})
export class WetlabMainComponent implements OnInit {

  WetLabs: WetLab[];
  Categories: WetLabCategory[];
  title = 'Sample preparation QC';

  constructor(
    private wetLabService: WetLabService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllWetlabs();
  }

  private getAllWetlabs(): void {
    this.wetLabService.getWetlabLists().subscribe(
      (res) => {
        this.WetLabs = res;
        this.Categories = this.processCategories(this.WetLabs);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private processCategories(wetlab: WetLab[]): WetLabCategory[] {
    const wetlabArray: WetLabCategory[] = [];

    for (const item of wetlab) {
      let found = 0;

      for (const exist of wetlabArray) {
        if (item.wetlabCategory.id === exist.id) {
          found = 1;
        }
      }

      if (found === 0) {
        wetlabArray.push(item.wetlabCategory);
      }
    }

    wetlabArray.sort((a, b) => a.id - b.id);
    return wetlabArray;
  }

  public navigate(wetLab: WetLab): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/wetlab/plot', wetLab.apiKey])
    );

    window.open(url, '_blank');
  }
}
