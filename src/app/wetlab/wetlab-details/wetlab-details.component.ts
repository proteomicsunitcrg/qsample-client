import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WetLabService } from '../../services/wetlab.service';

@Component({
  selector: 'app-wetlab-details',
  templateUrl: './wetlab-details.component.html',
  styleUrls: ['./wetlab-details.component.css']
})
export class WetlabDetailsComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private wetLabService: WetLabService) { }

  ngOnInit(): void {
    this.activeRouter.params.subscribe(
      params => {
        console.log(params);
        this.wetLabService.getByApiKey(params.apiKey).subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.error(err);
          }
        );
      }
    );
  }

}
