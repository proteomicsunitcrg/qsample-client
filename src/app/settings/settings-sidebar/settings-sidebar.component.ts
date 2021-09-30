import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.css']
})
export class SettingsSidebarComponent implements OnInit {

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
