import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  currentRequest = {
    apiKey: "14",
    class: "Structural elucidation of crosslinked protein complexes",
    created_by: {
      email: "Muhammad Avdol",
    },
    date_created: "2020-01-23",
    status: "Completed",
    request_code: "LZ012"
  }

  ngOnInit(): void {
  }


  public goBack(): void {
    this.router.navigate(['/application']);
  }

}
