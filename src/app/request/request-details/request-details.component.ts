import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/Application';
import { FavoriteRequestService } from '../../services/favoriteRequest.service';
import { FavoriteRequest } from 'src/app/models/FavoriteRequest';
import { FavoriteRequestUser } from 'src/app/models/FavoriteRequestUser';

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
            console.log(res);
            
            this.request = res;
            if (this.request.localCode !== null) { // means that a local code is setted so we dont have to use the agendo response and we avoid the "parser"
              this.requestCode = this.request.localCode;
            } else {
              this.requestCode = this.getRequestCodeFromRequest(this.request);
              this.requestService.changeRequestCode(this.requestCode);
              this.getApplicationInformation();
            }
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

  favoriteRequestRelation: FavoriteRequestUser;

  // var to handle if the request is fav or not
  isFav = false;

  // var to handle if the request is notify or not
  isNotify = false;

  isQcloud2FilesDisabled = true;

  ngOnInit(): void {
    this.getIsQCloud2FilesEnabled();
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

  private addToFavorites(): void {
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
    this.favRequestService.getFavRequestByAgendoId(this.requestId).subscribe(
      res => {
        this.favoriteRequestRelation = res;
        if (this.favoriteRequestRelation !== null) {
          this.isFav = true;
          this.isNotify = this.favoriteRequestRelation.notify;
        } else {
          this.isFav = false;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  private removeFromFavorites(): void {
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

  public removeOrAddToFavorites(): void {
    if (this.isFav) {
      this.removeFromFavorites();
    } else {
      this.addToFavorites();
    }
  }

  public removeOrAddToNotify(): void {
    let action: boolean;
    if (this.isNotify) {
      action = false;
    } else {
      action = true;
    }
    this.favRequestService.setNotify(this.favoriteRequestRelation.favoriteRequest, action).subscribe(
      res => {
        this.checkIfRequestIsFavorite();
      },
      err => {
        console.error(err);
      }
    );
  }

  private getIsQCloud2FilesEnabled(): void {
    this.requestService.isQcloud2FilesEnabled().subscribe(
      res => {
        this.isQcloud2FilesDisabled = res;
      },
      err => {
        console.error(err)
      }
    )
  }

}
