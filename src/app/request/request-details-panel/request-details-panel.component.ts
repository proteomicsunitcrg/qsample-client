import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-details-panel',
  templateUrl: './request-details-panel.component.html',
  styleUrls: ['./request-details-panel.component.css']
})
export class RequestDetailsPanelComponent implements OnInit {

  constructor() { }

  @Input("request") request: any;

  ngOnInit(): void {
  }

}
