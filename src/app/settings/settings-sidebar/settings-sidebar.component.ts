import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.css'],
})
export class SettingsSidebarComponent implements OnInit {
  subscription: Subscription;
  isLocalMode = false;
  isAdmin = false;
  isManager = false;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private tokenStorageService: TokenStorageService
  ) {
    this.subscription = authService.getIsAdmin().subscribe((res) => (this.isAdmin = res));
    this.subscription = authService.getIsManager().subscribe((res) => (this.isManager = res));
  }

  ngOnInit(): void {
    this.requestService.getIsLocalModeEnabled().subscribe(
      (res) => {
        this.isLocalMode = res;
      },
      (err) => {
        console.error(err);
      }
    );

    this.authService.updateIsAdmin(this.tokenStorageService.isAdminUser());
    this.authService.updateIsManager(this.tokenStorageService.isManagerUser());
  }
}
