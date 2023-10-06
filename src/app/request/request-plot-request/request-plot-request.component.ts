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

  isLocalMode = false;

  isNeonDisabled = true;


  constructor(private requestService: RequestService, private quantificationService: QuantificationService) {
    this.myEventSubscription = this.requestService.currentRequestCode.subscribe(
      value => {
        if (value !== undefined) {
          this.requestCode = value;
        }
      },
      err => {
        console.error(err);
      }
    );

    this.applicationSubcription = this.requestService.currentApplication.subscribe(
      value => {
        this.application = value;
      },
      err => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.getShowNeonStats();

    this.requestService.getIsLocalModeEnabled().subscribe(
      res => {
        this.isLocalMode = res;
      },
      err => {
        console.error(err);
      }
    );
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
