import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/Application';
import { FavoriteRequestService } from '../../services/favoriteRequest.service';
import { FavoriteRequest } from 'src/app/models/FavoriteRequest';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private authService: AuthService, private activeRouter: ActivatedRoute,
    private requestService: RequestService, private applicationService: ApplicationService,
    private favRequestService: FavoriteRequestService) {
    this.subscription = this.authService.getIsInternal().subscribe(res => this.isInternal = res);
    this.activeRouter.params.subscribe(
      params => {
        this.requestId = params.apiKey;
        this.checkIfRequestIsFavorite();
        this.requestService.getRequestDetails(params.apiKey).subscribe(
          res => {
            this.request = res;
            this.requestCode = this.getRequestCodeFromRequest(this.request);
            this.requestService.changeRequestCode(this.requestCode);
            this.getApplicationInformation();
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

  application: Application;

  // var to handle if the request is fav or not
  isFav = false;

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

  private getApplicationInformation(): void {
    this.applicationService.getByName(this.request['classs']).subscribe(
      res => {
        this.application = res;
        console.log(this.application);

        if (!this.application.applicationConstraint) {
          alert("Constraint not setted ATM");
        } else {
          this.requestService.changeCurrentApplication(this.application);
        }
      },
      err => {
        console.error(err);
      }
    )
  }

  public addToFavorites(): void {
    const favRequest = new FavoriteRequest(null, this.requestId, this.requestCode);
    this.favRequestService.setFavRequest(favRequest).subscribe(
      res => {
        this.checkIfRequestIsFavorite();
      },
      err => {
        console.error(err);
      }
    );
  }

  private checkIfRequestIsFavorite(): void {
    this.favRequestService.checkIfRequestIsFav(this.requestId).subscribe(
      res => {
        this.isFav = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  public removeFromFavorites(): void {
    const favRequest = new FavoriteRequest(null, this.requestId, this.requestCode);
    this.favRequestService.deleteFavRequest(favRequest).subscribe(
      res => {
        this.checkIfRequestIsFavorite();
      },
      err => {
        console.error(err);
      } 
    );
  }

  // private getRequestDetails()

}
