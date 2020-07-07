import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {


  constructor(private requestService: RequestService, private router: Router) { }
  caca = [
    {
      apiKey: "12",
      class: "Identification of a protein in a gel band",
      created_by: {
        email: "Dio Brando",
      },
      date_created: "2019-01-12",
      status: "In progress"
    },
    {
      apiKey: "13",
      class: "TMT: Proteome quantification",
      created_by: {
        email: "Giorno Giovanna",
      },
      date_created: "2019-03-23",
      status: "In progress"
    },
    {
      apiKey: "14",
      class: "Structural elucidation of crosslinked protein complexes",
      created_by: {
        email: "Muhammad Avdol",
      },
      date_created: "2020-01-23",
      status: "Completed"
    },
  ];
  columnsToDisplay = ['class', 'creator', 'dateCreated', 'status'];
  ngOnInit(): void {
    // this.getAllRequests();
  }

  public goTo(request): void {
    console.log(request);
    this.router.navigate(['/application/request/details', request.apiKey]);

  }

  /**
   *
   */
  private getAllRequests(): void {
    this.requestService.getAllRequests().subscribe(
      res => {
        this.caca = res.request;
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
  }
}
