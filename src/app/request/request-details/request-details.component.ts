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
import { SessionStorage } from '../../services/sessionStorage.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css'],
})
export class RequestDetailsComponent implements OnInit, OnDestroy {
  isAgendoDown = false;
  isLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private activeRouter: ActivatedRoute,
    private requestService: RequestService,
    private applicationService: ApplicationService,
    private favRequestService: FavoriteRequestService,
    private sessionStorageService: SessionStorage,
    private fileService: FileService
  ) {
    this.subscription = this.authService.getIsInternal().subscribe((res) => (this.isInternal = res));
    this.activeRouter.params.subscribe((params) => {
      if (params.apiKey.match(/^[0-9]+$/)) {
        this.handleByRequestId(params.apiKey);
        this.isLoading = false;
      } else {
        this.requestService.getIsLocalModeEnabled().subscribe(
          (res) => {
            this.isLocalMode = res;

            if (this.isLocalMode) {
              this.handleByRequestCode(params.apiKey);
              this.isLoading = false;
            } else {
              const requests = this.sessionStorageService.getRequestsJson();

              if (requests && requests.hasOwnProperty(params.apiKey)) {
                this.requestId = requests[params.apiKey]['id'];
                this.handleByRequestId(this.requestId, params.apiKey);
                this.isLoading = false;
              } else {
                const requestYear = this.extractYearFromRequestCode(params.apiKey);
                let previousDate: Date;
                let currentDate: Date;

                if (requestYear) {
                  previousDate = new Date(requestYear, 0, 1);
                  currentDate = new Date(requestYear, 11, 31);
                } else {
                  currentDate = new Date();
                  previousDate = this.subtractYears(currentDate, 1);
                }

                this.requestService.getAllRequestsInternal(true, previousDate, currentDate).subscribe(
                  (res) => {
                    this.sessionStorageService.storeRequests(res);
                    const updatedRequests = this.sessionStorageService.getRequestsJson();

                    if (updatedRequests.hasOwnProperty(params.apiKey)) {
                      this.requestId = updatedRequests[params.apiKey]['id'];
                      this.isLoading = false;
                      this.handleByRequestId(this.requestId);
                    } else {
                      this.handleQSampleOnlyRequest(params.apiKey);
                    }
                  },
                  (err) => {
                    this.request = null;
                    this.requestCode = null;
                    this.application = null;
                    this.isLoading = false;
                    this.isAgendoDown = true;
                    console.error(err);
                  }
                );
              }
            }
          },
          (err) => {
            this.isLoading = false;
            console.error(err);
          }
        );
      }
    });
  }

  requestId: number;

  subscription: Subscription;
  isInternal = false;

  local: boolean;

  isLocalMode = true;

  request: any;

  requestCode: string;

  application: Application;

  favoriteRequestRelation: FavoriteRequestUser;

  isFav = false;

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
    window.open('https://qgenerator.crg.eu', '_blank');
  }

  private getApplicationInformation(): void {
    let classs = 'User tailored request (Proteomics)';

    if (this.request) {
      classs = this.request['classs'];

      if (!classs && this.request.application) {
        classs = this.request.application.name;
        this.request['classs'] = classs;
      }

      if (!classs) {
        classs = 'User tailored request (Proteomics)';
        this.request['classs'] = classs;
      }
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

  private extractYearFromRequestCode(requestCode: string): number | null {
    const match = requestCode.match(/^(\d{4})/);

    if (!match) {
      return null;
    }

    return Number(match[1]);
  }

  private handleByRequestId(requestId: number, requestCode?: string): void {
    this.checkIfRequestIsFavorite(requestId);
    this.requestService.getRequestDetails(requestId).subscribe(
      (res) => {
        this.request = res;

        if (this.request.localCode !== null) {
          this.requestCode = this.request.localCode;
          this.local = true;

          if (this.request.created_by === null && this.request.localCreator !== null) {
            this.request.created_by = {};
            this.request.created_by.name = this.request.localCreator;
            this.request.created_by.email = '';
          }

          this.requestService.changeRequestCode(this.requestCode);
          this.getApplicationInformation();
        } else {
          this.local = false;
          this.requestCode = this.request.ref;
          this.requestService.changeRequestCode(this.requestCode);
          this.getApplicationInformation();
        }

        this.isLoading = false;
      },
      (err) => {
        this.request = null;
        this.requestCode = null;
        this.application = null;
        this.isLoading = false;
        this.isAgendoDown = true;
        console.error(err);
      }
    );
  }

  private handleQSampleOnlyRequest(requestCode: string): void {
    this.fileService.getFilesByRequestCode(requestCode, 'filename').subscribe(
      (files) => {
        if (files && files.length > 0) {
          this.requestId = null;
          this.requestCode = requestCode;
          this.local = true;

          this.request = {
            id: null,
            ref: requestCode,
            localCode: requestCode,
            classs: 'User tailored request (Proteomics)',
            created_by: {
              name: 'Not available in Agendo',
              email: ''
            },
            date_created: files[0].creation_date || files[0].creationDate || '',
            localCreator: 'Not available in Agendo',
            localCreationDate: files[0].creation_date || files[0].creationDate || '',
            status: 'QSample data only'
          };

          this.checkIfRequestIsFavoriteByRequestCode(this.requestCode);
          this.requestService.changeRequestCode(this.requestCode);
          this.getApplicationInformation();
          this.isLoading = false;
        } else {
          alert('Request not found in Agendo and no QSample data found!');
          this.isLoading = false;
        }
      },
      (err) => {
        this.request = null;
        this.requestCode = null;
        this.application = null;
        this.isLoading = false;
        console.error(err);
      }
    );
  }

  private handleByRequestCode(requestCode: string): void {
    this.requestService.getRequestDetailsByRequestCode(requestCode).subscribe(
      (res) => {
        this.request = res;
        this.requestCode = requestCode;
        this.checkIfRequestIsFavoriteByRequestCode(this.requestCode);

        this.local = true;

        if (this.request) {
          this.request.created_by = {};
          this.request.created_by.name = this.request.creator;
          this.request.created_by.email = this.request.creator;
          this.request.date_created = this.request.creation_date;
        }

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

  private checkIfRequestIsFavoriteByRequestCode(requestCode?: string): void {
    if (!requestCode) {
      requestCode = this.requestCode;
    }

    this.favRequestService.getFavRequestByRequestCode(requestCode).subscribe(
      (res) => {
        this.favoriteRequestRelation = res;

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

  private checkIfRequestIsFavorite(requestId?: number): void {
    if (!requestId) {
      requestId = this.requestId;
    }

    if (requestId) {
      this.favRequestService.getFavRequestByAgendoId(requestId).subscribe(
        (res) => {
          this.favoriteRequestRelation = res;

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
    } else {
      if (this.requestCode) {
        this.favRequestService.getFavRequestByRequestCode(this.requestCode).subscribe(
          (res) => {
            this.favoriteRequestRelation = res;

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
    }
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
}