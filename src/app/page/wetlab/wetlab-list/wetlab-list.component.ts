import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../services/messages.service'
import { WetLab } from '../../../models/WetLab';
import { WetLabCategory } from '../../../models/WetLabCategory';
import { WetLabService } from '../../../services/wetlab.service';
import { Router } from '@angular/router';

// TODO: Improve component handling of categories and items
// Consider: https://stackoverflow.com/questions/48204477/passing-ngfor-variable-to-an-ngif-template
@Component({
  selector: 'app-wetlab-list',
  templateUrl: './wetlab-list.component.html',
  styleUrls: ['./wetlab-list.component.css']
})
export class WetlabListComponent implements OnInit {

  constructor(private wetLabService: WetLabService, private messagesService: MessagesService, private router: Router) { }

  messages = {};
  WetLabs: WetLab[];
  Categories: WetLabCategory[];
  additional: string;
  title: string;

  ngOnInit(): void {

    // TODO: Part of the migration
    this.getMessages();
    console.log(this.messages);

    // this.title = window['env']['general-wetlab-home']; # TODO: Migrate
    this.title = 'Sample preparation QC';
    this.additional = '';
    // if ( ! window['env']['local_requests']  ) { # TODO: Migrate
    if ( this.wetLabService.apiPrefix.includes('qsample.crg.eu') ) {
      this.additional = '(New 30 min gradient starting from 14/02/2022)';
      // this.title = window['env']['general-wetlab-production']; # TODO: Migrate
      this.title = 'Wetlab';
    }

    this.getAllWetlabs();
  }

  private getAllWetlabs() {
    this.wetLabService.getWetlabLists().subscribe(
      res => {
        this.WetLabs = res;
        // Process wetlab categories below
        this.Categories = this.processCategories(this.WetLabs);
      },
      err => {
        console.error(err);
      }
    );
  }

  // private retrieveMessages() {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve('resolved');
  //   }, 2000);
  //   });
  // }

  private getMessages() {
    this.messagesService.getMessages().subscribe(
      res => {
        this.messages = res;
      },
      err => {
        console.error(err);
      }
    );
  }


  private processCategories(wetlab: WetLab[]) {
    let wetlabArray = [];
    for ( let item of wetlab ) {
      let found = 0;
      for ( let exist of wetlabArray ) {
        if ( item.wetlabCategory.id === exist.id ) {
          found = 1;
        }
      }
      if ( found === 0 ) {
        wetlabArray.push(item.wetlabCategory);
      }
    }
    wetlabArray.sort(function(a, b) { 
      return a.id - b.id;
    });
    return wetlabArray;
  }

  public navigate(wetLab: WetLab) {
    this.router.navigate(['/wetlab/plot', wetLab.apiKey]);
  }

  public navigateToGuideset() {
    this.router.navigate(['/wetlab/guideset']);
  }

}
