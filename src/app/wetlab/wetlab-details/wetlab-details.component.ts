import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WetLab } from '../../models/WetLab';
import { WetLabService } from '../../services/wetlab.service';

@Component({
  selector: 'app-wetlab-details',
  templateUrl: './wetlab-details.component.html',
  styleUrls: ['./wetlab-details.component.css'],
})
export class WetlabDetailsComponent implements OnInit {
  apiKey: string;

  wetlab = new WetLab(null, null, null, null, null);

  constructor(
    private route: ActivatedRoute,
    private wetLabService: WetLabService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apiKey = this.route.snapshot.params.apiKey;

    this.wetLabService.getByApiKey(this.apiKey).subscribe(
      (res) => {
        this.wetlab = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public goBack(): void {
    this.router.navigate([''], {
      queryParams: {
        tab: 'sample-qc'
      }
    });
  }
}