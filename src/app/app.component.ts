import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private tokenStorageService: TokenStorageService, private authService: AuthService) { }

  title = 'qsample-client';

  ngOnInit(): void {
    this.getMajorRole();
  }

  private getMajorRole(): void {
    this.authService.updateIsInternal(this.tokenStorageService.isInternalUser());
    this.authService.updateIsAdmin(this.tokenStorageService.isAdminUser());
  }

}
