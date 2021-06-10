import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
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


  constructor(private requestService: RequestService) {
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

  }

  ngOnDestroy(): void {
    this.myEventSubscription.unsubscribe();
  }

}
