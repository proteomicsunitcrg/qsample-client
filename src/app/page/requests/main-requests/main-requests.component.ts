import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-main-requests',
  templateUrl: './main-requests.component.html',
  styleUrls: ['./main-requests.component.css']
})
export class MainRequestsComponent implements OnInit {

  agendoOnline: boolean | null = null;

  constructor(
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    this.checkAgendoStatus();
  }

  private checkAgendoStatus(): void {
    this.agendoOnline = null;

    this.requestService.getAgendoStatus().subscribe(
      (res) => {
        this.agendoOnline = !!res.online;
      },
      (err) => {
        this.agendoOnline = false;
        console.error(err);
      }
    );
  }

}