import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {
    this.subscription = this.authService.getIsInternal().subscribe(res => this.isInternal = res);
  }


  subscription: Subscription;
  isInternal = false;

  currentRequest = {
    apiKey: "14",
    class: "Structural elucidation of crosslinked protein complexes",
    created_by: {
      email: "Muhammad Avdol",
    },
    date_created: "2020-01-23",
    status: "Completed",
    request_code: "LZ012"
  }

  ngOnInit(): void {
    console.log(this.isInternal);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public caca() {
    console.log('hola');
  }


  public goBack(): void {
    this.router.navigate(['/application']);
  }

}
