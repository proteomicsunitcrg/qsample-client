import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings-local-request',
  templateUrl: './settings-local-request.component.html',
  styleUrls: ['./settings-local-request.component.css']
})
export class SettingsLocalRequestComponent implements OnInit {

  subscription: Subscription;
  isManager = false;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private authService: AuthService) {
    this.subscription = authService.getIsManager().subscribe((res) => (this.isManager = res));
  }
  ngOnInit(): void {
    this.authService.updateIsManager(this.tokenStorageService.isManagerUser());
  }

  public newRequest(): void {
    this.router.navigate(['/settings/local/request/editor', 'new']);
  }

}
