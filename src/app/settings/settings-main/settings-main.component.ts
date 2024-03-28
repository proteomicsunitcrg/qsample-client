import { Component, OnInit } from '@angular/core';
import { ServerConfigService } from '../../services/serverconfig.service';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.css']
})
export class SettingsMainComponent implements OnInit {

  constructor(
    private serverConfigService: ServerConfigService
  ) {}

  local: boolean = true;

  ngOnInit(): void {

    this.getServerConfig();
  }

  private getServerConfig() {
    this.serverConfigService.getConfig().subscribe(
      (res) => {
        if (res.hasOwnProperty('local_requests')) {
          this.local = res['local_requests'];
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }


}
