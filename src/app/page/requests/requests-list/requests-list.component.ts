import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';
@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {


  constructor(private requestService: RequestService) { }
  caca = [];
  columnsToDisplay = ['class', 'creator', 'dateCreated', 'status'];
  ngOnInit(): void {
    this.getAllRequests();
  }

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
