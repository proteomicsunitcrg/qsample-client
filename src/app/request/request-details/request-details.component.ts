import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/Application';
import { FavoriteRequestService } from '../../services/favoriteRequest.service';
import { FavoriteRequest } from 'src/app/models/FavoriteRequest';
import { FavoriteRequestUser } from 'src/app/models/FavoriteRequestUser';
import { MiniRequest } from 'src/app/models/MiniRequest';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css'],
})
export class RequestDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private authService: AuthService,
    private activeRouter: ActivatedRoute,
    private requestService: RequestService,
    private applicationService: ApplicationService,
    private favRequestService: FavoriteRequestService
  ) {
    this.subscription = this.authService.getIsInternal().subscribe((res) => (this.isInternal = res));
    this.activeRouter.params.subscribe((params) => {
      if (params.apiKey.match(/^[0-9]+$/)) {
        // Handle by requestId
        this.handleByRequestId(params.apiKey);
      } else {
        this.requestService.getIsLocalModeEnabled().subscribe(
          (res) => {
            this.isLocalMode = res;
            if (this.isLocalMode) {
              // Handle by requestCode
              this.handleByRequestCode(params.apiKey);
            } else {
              // We retrieve the request id from the session storage
              // TODO: Problem if sessionStorage has no request id
              let requests = JSON.parse(sessionStorage.getItem('requests'));
              if (requests.hasOwnProperty(params.apiKey)) {
                this.requestId = requests[params.apiKey]['id'];
                this.handleByRequestId(this.requestId);
              } else {
                // Get currentDate
                let currentDate = new Date();
                let allYears = 10; // TODO: To handle in a different way
                let previousDate = this.subtractYears(currentDate, allYears);

                this.requestService.getAllRequestsInternal(true, previousDate, currentDate).subscribe(
                  (res) => {
                    this.storeRequestsInSessionStorage(res);
                    let requests = JSON.parse(sessionStorage.getItem('requests'));
                    if (requests.hasOwnProperty(params.apiKey)) {
                      this.requestId = requests[params.apiKey]['id'];
                      this.handleByRequestId(this.requestId);
                    } else {
                      alert('Request not found in Agendo!'); // TODO: Handle in a dialog.
                    }
                  },
                  (err) => {
                    console.error(err);
                  }
                );
                // Try this: https://stackoverflow.com/questions/69197245/reacjs-popup-how-do-i-trigger-a-popup-without-it-being-click-hover
              }
            }
          },
          (err) => {
            console.error(err);
          }
        );
      }
    });
  }

  requestId: number;

  subscription: Subscription;
  isInternal = false;

  // TODO: Handle redundancy with isLocalMode
  local: boolean;

  isLocalMode = true;

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public goBack(): void {
    this.router.navigate(['']);
  }

  public goToQGenerator(): void {
    // Moved to QGenerator with request code and request id
    // TODO: To be removed below and handed in request-queue-generator.component.ts with sessionStorage
    let apiKey = this.requestCode;
    if (this.requestId) {
      apiKey += '|' + String(this.requestId);
    }
    this.router.navigate(['/request/QGenerator', apiKey]);
  }

  private getApplicationInformation(): void {
    let classs = this.request['classs'];
    if (!classs) {
      classs = this.request.application.name;
      this.request['classs'] = classs;
    }
    this.applicationService.getByName(classs).subscribe(
      (res) => {
        this.application = res;
        if (!this.application.applicationConstraint) {
          alert('Constraint not setted ATM');
        } else {
          this.requestService.changeCurrentApplication(this.application);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  private handleByRequestId(requestId: number): void {
    this.checkIfRequestIsFavorite(requestId);
    this.requestService.getRequestDetails(requestId).subscribe(
      (res) => {
        this.request = res;
        // console.log( this.request );
        if (this.request.localCode !== null) {
          // means that a local code is setted so we dont have to use the agendo response and we avoid the "parser"
          this.requestCode = this.request.localCode;
          this.local = true;

          // console.log(this.requestCode);
          // TODO: Rethink if a better way
          if (this.request.created_by === null && this.request.localCreator !== null) {
            // console.log("Hack on local creator!");
            this.request.created_by = {};
            this.request.created_by.name = this.request.localCreator;
            this.request.created_by.email = '';
            // console.log(this);
          }
          // console.log( "We trigger info retrieval as well" );
          this.requestService.changeRequestCode(this.requestCode);
          this.getApplicationInformation();
        } else {
          this.local = false;
          this.requestCode = this.request.ref; // We directly get from ref response
          this.requestService.changeRequestCode(this.requestCode);
          this.getApplicationInformation();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // TODO: Need to review all this function with requestCode first scenario
  private handleByRequestCode(requestCode: string): void {
    // console.log( this.requestId );
    this.requestService.getRequestDetailsByRequestCode(requestCode).subscribe(
      (res) => {
        console.log(this);
        this.request = res;
        this.requestCode = requestCode;
        this.checkIfRequestIsFavorite(this.request.id);

        this.local = true;
        this.request.created_by = {};
        this.request.created_by.name = this.request.creator;
        this.request.created_by.email = this.request.creator;
        this.request.date_created = this.request.creation_date;
        this.requestService.changeRequestCode(this.requestCode);
        this.getApplicationInformation();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private addToFavorites(): void {
    const favRequest = new FavoriteRequest(null, this.requestId, this.requestCode);
    this.favRequestService.setFavRequest(favRequest).subscribe(
      (res) => {
        this.checkIfRequestIsFavorite();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private checkIfRequestIsFavorite(requestId?: number): void {
    if (!requestId) {
      requestId = this.requestId;
    }
    // console.log("REQUEST %s", requestId);
    this.favRequestService.getFavRequestByAgendoId(requestId).subscribe(
      (res) => {
        this.favoriteRequestRelation = res;
        // console.log(this.favoriteRequestRelation);
        if (this.favoriteRequestRelation !== null) {
          this.isFav = true;
          this.isNotify = this.favoriteRequestRelation.notify;
        } else {
          this.isFav = false;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private removeFromFavorites(): void {
    const favRequest = new FavoriteRequest(null, this.requestId, this.requestCode);
    this.favRequestService.deleteFavRequest(favRequest).subscribe(
      (res) => {
        this.checkIfRequestIsFavorite();
      },
      (err) => {
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
      (res) => {
        this.checkIfRequestIsFavorite();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getIsQCloud2FilesEnabled(): void {
    this.requestService.isQcloud2FilesEnabled().subscribe(
      (res) => {
        this.isQcloud2FilesDisabled = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private subtractYears(date: Date, years: number): Date {
    const dateCopy = new Date(date);

    dateCopy.setFullYear(dateCopy.getFullYear() - years);

    return dateCopy;
  }

  // TODO: review sessionStorage here: https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks - Move to another module
  private storeRequestsInSessionStorage(requests: MiniRequest[]): void {
    let storeRequests = {};
    for (const request of requests) {
      storeRequests[request.lastField] = request;
    }

    let currentCount = 0;
    if (sessionStorage.getItem('requests_count')) {
      currentCount = parseInt(sessionStorage.getItem('requests_count'), 10);
    }

    if (currentCount < requests.length) {
      sessionStorage.setItem('requests_count', requests.length.toString());
      sessionStorage.setItem('requests', JSON.stringify(storeRequests));
    }
  }
}
