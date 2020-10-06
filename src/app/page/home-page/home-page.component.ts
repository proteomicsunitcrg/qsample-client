import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) {
    this.subscription = this.authService.getIsInternal().subscribe(res => this.isInternal = res);
  }

  subscription: Subscription;
  isInternal = false;
  ngOnInit(): void {
    this.authService.updateIsInternal(this.tokenStorageService.isInternalUser());
    console.log(this.isInternal);

  }

}
