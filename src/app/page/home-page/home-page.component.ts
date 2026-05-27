import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  subscription: Subscription;

  isInternal = false;

  selectedTabIndex = 0;

  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute
  ) {
    this.subscription = this.authService.getIsInternal().subscribe(res => this.isInternal = res);
  }

  ngOnInit(): void {
    this.authService.updateIsInternal(this.tokenStorageService.isInternalUser());

    this.route.queryParams.subscribe(params => {
      if (params.tab === 'sample-qc') {
        this.selectedTabIndex = 1;
      } else {
        this.selectedTabIndex = 0;
      }
    });
  }

}