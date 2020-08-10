import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-queue-generator',
  templateUrl: './request-queue-generator.component.html',
  styleUrls: ['./request-queue-generator.component.css']
})
export class RequestQueueGeneratorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('QGenerator');

  }

}
