import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private authService: AuthService, private activeRouter: ActivatedRoute,
    private requestService: RequestService) {
    this.subscription = this.authService.getIsInternal().subscribe(res => this.isInternal = res);
    this.activeRouter.params.subscribe(
      params => {
        this.requestId = params.apiKey;
        this.requestService.getRequestDetails(params.apiKey).subscribe(
          res => {
            console.log(res);
            this.request = res;
            this.requestCode = this.getRequestCodeFromRequest(this.request);
            console.log(this.requestCode);

            this.requestService.changeRequestCode(this.requestCode);
          },
          err => {
            console.error(err);
          }
        );
      }
    );
  }

  requestId: number;

  subscription: Subscription;
  isInternal = false;

  request: any;

  requestCode: string;

  ngOnInit(): void {

  }

  // TODO: Improve the parser. RN is a piece of shit but the AGENDO response is crap

  private getRequestCodeFromRequest(request: any): string {
    const cac = JSON.parse(request.fields[request.fields.length - 1].value);
    return cac[0][0].value.split('|')[0];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public goBack(): void {
    this.router.navigate(['']);
  }

  public goToQGenerator(): void {
    this.router.navigate(['/request/QGenerator', this.requestId]);
  }

  // private getRequestDetails()

}
