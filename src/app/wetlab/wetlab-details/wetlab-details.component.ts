import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WetLabService } from '../../services/wetlab.service';
import { WetLab } from '../../models/WetLab';

@Component({
  selector: 'app-wetlab-details',
  templateUrl: './wetlab-details.component.html',
  styleUrls: ['./wetlab-details.component.css']
})
export class WetlabDetailsComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private wetLabService: WetLabService) { }

  wetlab = new WetLab(null, null, null, null);

  ngOnInit(): void {
    this.activeRouter.params.subscribe(
      params => {
        console.log(params);
        this.wetLabService.getByApiKey(params.apiKey).subscribe(
          res => {
            console.log(res);
            this.wetlab = res;
          },
          err => {
            console.error(err);
          }
        );
      }
    );
  }

}
