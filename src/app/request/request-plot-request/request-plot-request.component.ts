import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-plot-request',
  templateUrl: './request-plot-request.component.html',
  styleUrls: ['./request-plot-request.component.css']
})
export class RequestPlotRequestComponent implements OnInit {

  myEventSubscription: Subscription;

  requestCode: any;

  constructor(private requestService: RequestService) {
    this.myEventSubscription = this.requestService.currentRequestCode.subscribe(value => {
      if (value !== undefined) {
        this.requestCode = value
      }
    }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.myEventSubscription.unsubscribe();
  }

}
