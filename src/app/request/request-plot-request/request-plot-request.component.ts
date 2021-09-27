import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuantificationService } from '../../services/quantification.service';
import { Application } from '../../models/Application';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-plot-request',
  templateUrl: './request-plot-request.component.html',
  styleUrls: ['./request-plot-request.component.css']
})
export class RequestPlotRequestComponent implements OnInit, OnDestroy {

  myEventSubscription: Subscription;

  applicationSubcription: Subscription;

  requestCode: any;

  application: Application;

  isNeonDisabled = true;


  constructor(private requestService: RequestService, private quantificationService: QuantificationService) {
    this.myEventSubscription = this.requestService.currentRequestCode.subscribe(value => {
      if (value !== undefined) {
        this.requestCode = value;
      }
    }
    );

    this.applicationSubcription = this.requestService.currentApplication.subscribe(
      value => {
        this.application = value;
      }
    )
  }

  ngOnInit(): void {
    this.getShowNeonStats();
  }

  ngOnDestroy(): void {
    this.myEventSubscription.unsubscribe();
  }

  private getShowNeonStats(): void {
    this.quantificationService.getIsNeonStatsEnabled().subscribe(
      res => {
        this.isNeonDisabled = res;
      },
      err => {
        console.error(err);
      }
    );
  }

}
