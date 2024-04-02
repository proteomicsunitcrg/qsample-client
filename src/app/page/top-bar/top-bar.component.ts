import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  subscription: Subscription;

  isAdmin = false;
  isManager = false;
  isLocalMode = false;

  constructor(private requestService: RequestService, private tokenService: TokenStorageService, private router: Router,
    private authService: AuthService, private tokenStorageService: TokenStorageService) {
    this.subscription = authService.getIsAdmin().subscribe(res => this.isAdmin = res);
    this.subscription = authService.getIsManager().subscribe(res => this.isManager = res);
  }

  ngOnInit(): void {

    this.requestService.getIsLocalModeEnabled().subscribe(
      res => {
        this.isLocalMode = res;
      },
      err => {
        console.error(err);
      }
    );

    this.authService.updateIsAdmin(this.tokenStorageService.isAdminUser());
    this.authService.updateIsManager(this.tokenStorageService.isManagerUser());
  }

  public goToHomePage(): void {
    this.router.navigate(['']);
  }

  public logout(): void {
    this.tokenService.signOut();
    this.navigate();
  }

  private navigate(): void {
    this.router.navigate(['/login']);
  }

  public goToRequestSettings(): void {
    this.router.navigate(['/settings/local/request']);
  }

  public goToUserPage(): void {
    this.router.navigate(['/settings/user']);
  }

  public goToHelp(): void {
    this.router.navigate(['/help']);
  }

  public goToFavorites(): void {
    this.router.navigate(['/favorite']);
  }

}
