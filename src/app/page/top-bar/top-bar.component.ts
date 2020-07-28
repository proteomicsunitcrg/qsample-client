import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  subscription: Subscription;

  isAdmin = false;

  constructor(private tokenService: TokenStorageService, private router: Router, private authService: AuthService) {
    this.subscription = authService.getIsAdmin().subscribe(res => this.isAdmin = res);
  }

  ngOnInit(): void {
    console.log(this.isAdmin);

  }

  public logout(): void {
    this.tokenService.signOut();
    this.navigate();
  }

  private navigate(): void {
    this.router.navigate(['/login']);
  }

  public goToSettings(): void {
    console.log('go to settings');

  }

}
