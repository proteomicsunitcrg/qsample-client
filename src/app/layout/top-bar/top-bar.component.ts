import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(private tokenService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
  }

  public logout(): void {
    this.tokenService.signOut();
    this.navigate();
  }

  private navigate(): void {
    this.router.navigate(['/login']);
  }

}
