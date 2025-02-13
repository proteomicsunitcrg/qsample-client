import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { RequestStatus } from '../../../../app/models/RequestStatus';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';
import { UserService } from 'src/app/services/user.service';
import { Application } from 'src/app/models/Application';
import { RequestLocal } from 'src/app/models/RequestLocal';
import { User } from 'src/app/models/User';
// import { sample } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-settings-local-request-creator',
  templateUrl: './settings-local-request-creator.component.html',
  styleUrls: ['./settings-local-request-creator.component.css'],
})
export class SettingsLocalRequestCreatorComponent implements OnInit {
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private localRequestService: RequestService,
    private applicationService: ApplicationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private fileService: FileService
  ) {}

  isEdit: boolean;

  allApplications: Application[] = [];

  allSamples = [];

  deleteable = false;

  requestStatusValues = RequestStatus;
  requestStatusValuesKeys(): Array<string> {
    const keys = Object.keys(this.requestStatusValues);
    return keys.slice(keys.length / 2);
  }

  leForm = new FormGroup({
    code: new FormControl('', Validators.required),
    group: new FormControl('', Validators.required),
    creator: new FormControl('', Validators.required),
    taxonomy: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    application: new FormControl('', Validators.required),
    sample: new FormControl(''),
    date: new FormControl('', Validators.required),
  });

  currentUser: Object = {};
  requestFromServer = new RequestLocal();

  ngOnInit(): void {
    this.getAllAplications();
    this.activeRouter.params.subscribe(
      (params) => {
        if (params.id !== 'new') {
          // console.log(params);
          this.getLocalRequest(params.id); // TODO: Change to requestCode here
          this.isEdit = true;
        } else {
          this.isEdit = false;
          this.addDefaultDateTimeValue();
          this.getCurrentUsername();
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getLocalRequest(requestCode: string) {
    this.localRequestService.getRequestDetailsByRequestCode(requestCode).subscribe(
      (res) => {
        this.requestFromServer = res;
        this.checkDeleteable();
        this.mountForm(res);
      },
      (err) => {
        this.openSnackBar('Error getting the request', 'Close'); // TODO: Move message
        this.router.navigate(['/settings/local/request']);
        console.error(err);
      }
    );
  }

  private getCurrentUsername(): void {
    this.userService.getCurrentUser().subscribe(
      (res) => {
        // console.log(res);
        this.currentUser = res;
        let fullname = [];
        let groupp = null;
        if (this.currentUser['firstname']) {
          fullname.push(this.currentUser['firstname']);
        }
        if (this.currentUser['lastname'] && this.currentUser['lastname'] != this.currentUser['firstname']) {
          fullname.push(this.currentUser['lastname']);
        }
        if (this.currentUser['groupp']) {
          groupp = this.currentUser['groupp'];
        }
        this.leForm.controls.creator.setValue(fullname.join(' '));
        if (groupp) {
          this.leForm.controls.group.setValue(groupp);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private addDefaultDateTimeValue(): void {
    // From: https://dev.to/kevinluo201/set-value-of-datetime-local-input-field-3435
    // getFullYear, getMonth, getDate, getHours, getMinutes all return values of local time.
    const convertToDateTimeLocalString = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const currentTime = new Date();

    this.leForm.controls.date.setValue(convertToDateTimeLocalString(currentTime));
  }

  private mountForm(request: any) {
    // Handle creation_date different possible formats and adapt to the form
    let creationDate = request.creation_date;
    this.leForm.controls.date.setValue(creationDate);
    this.leForm.controls.date.disable();
    this.leForm.controls.code.setValue(request.requestCode);
    this.leForm.controls.code.disable();
    this.leForm.controls.group.setValue(request.group);
    this.leForm.controls.creator.setValue(request.creator);
    this.leForm.controls.taxonomy.setValue(request.taxonomy);
    this.leForm.controls.status.setValue(request.status);
    this.leForm.controls.application.setValue(request.application);
    this.leForm.controls.application.disable();
    this.parseSamples(request.samples);
  }

  private parseSamples(samples: string): void {
    if (samples == '') {
      return;
    }
    this.allSamples = samples.split('---');
  }

  private getAllAplications(): void {
    this.applicationService.getAll().subscribe(
      (res) => {
        this.allApplications = res;
      },
      (err) => {
        this.openSnackBar('Error getting the applications', 'Close'); // TODO: Move message
        console.error(err);
      }
    );
  }

  private trimValue(value: string): string {
    let newValue = value;
    if (newValue) {
      newValue = newValue.trim();
    }
    return newValue;
  }

  public addSample(): void {
    this.allSamples.push(this.trimValue(this.leForm.controls.sample.value));
    this.leForm.controls.sample.setValue('');
  }

  public removeSample(sample: string): void {
    const index = this.allSamples.findIndex((i) => i === sample);
    this.allSamples.splice(index, 1);
  }

  public submit(): void {
    let allSamples = '';
    for (const sample of this.allSamples) {
      allSamples += `${sample}---`;
    }
    allSamples = allSamples.slice(0, -3);
    const localRequestToSend = new RequestLocal();
    localRequestToSend.id = this.requestFromServer.id;
    localRequestToSend.requestCode = this.trimValue(this.leForm.controls.code.value);
    localRequestToSend.application = this.leForm.controls.application.value;
    // Several hacks below to avoid problems with date format
    let formDate = this.leForm.controls.date.value.toString();
    if (!formDate.includes(':')) {
      formDate = formDate + ' 00:00'; // Hack for adding HH:mm:ss
    }
    if (formDate.includes('T')) {
      formDate = formDate.replace('T', ' ');
    }
    if (formDate.includes('Z')) {
      formDate = formDate.replace('Z', '');
    }
    formDate = formDate + ':00'; // Adding miliseconds

    localRequestToSend.creation_date = formDate;
    localRequestToSend.creator = this.trimValue(this.leForm.controls.creator.value);
    localRequestToSend.group = this.trimValue(this.leForm.controls.group.value);
    localRequestToSend.status = this.leForm.controls.status.value;
    localRequestToSend.taxonomy = this.trimValue(this.leForm.controls.taxonomy.value);
    localRequestToSend.samples = allSamples;
    this.localRequestService.saveLocalRequest(localRequestToSend).subscribe(
      (res) => {
        this.openSnackBar('Request saved', 'Close'); // TODO: Move message
        this.router.navigate(['/settings/local/request']); // Back once saved
      },
      (err) => {
        this.openSnackBar('Error saving the request', 'Close'); // TODO: Move message
        console.error(err);
      }
    );
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public delete(): void {
    this.localRequestService.deleteLocalRequest(this.requestFromServer).subscribe(
      (res) => {
        this.openSnackBar('Request deleted', 'Close'); // TODO: Move message
        this.router.navigate(['/settings/local/request']);
      },
      (err) => {
        this.openSnackBar('Error deleting the request', 'Close'); // TODO: Move message
        console.error(err);
      }
    );
  }

  public goBack(): void {
    this.router.navigate(['/settings/local/request']);
  }

  private checkDeleteable(): void {
    this.fileService.getFilesByRequestCode(this.requestFromServer.requestCode, 'asc').subscribe(
      (res) => {
        if (res == null) {
          this.deleteable = true;
        } else {
          this.deleteable = false;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
