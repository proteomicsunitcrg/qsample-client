import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-help-sidebar',
  templateUrl: './help-sidebar.component.html',
  styleUrls: ['./help-sidebar.component.css']
})
export class HelpSidebarComponent implements OnInit {

  constructor(private requestService: RequestService) { }

  isLocalMode = false;

  ngOnInit(): void {
    this.requestService.getIsLocalModeEnabled().subscribe(
      res => {
        this.isLocalMode = res;
      },
      err => {
        console.error(err);
      }
    );
  }

}
