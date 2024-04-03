import { Component, OnInit } from '@angular/core';
import { ServerConfigService } from '../../services/serverconfig.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.css'],
})
export class SettingsMainComponent implements OnInit {
  subscription: Subscription;
  isAdmin = false;
  isManager = false;

  constructor(
    private serverConfigService: ServerConfigService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {
    this.subscription = authService.getIsAdmin().subscribe((res) => (this.isAdmin = res));
    this.subscription = authService.getIsManager().subscribe((res) => (this.isManager = res));
  }

  local: boolean = true;

  ngOnInit(): void {
    this.getServerConfig();
    this.authService.updateIsAdmin(this.tokenStorageService.isAdminUser());
    this.authService.updateIsAdmin(this.tokenStorageService.isManagerUser());
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
