import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from 'src/app/services/request.service';
import { RequestStatus } from '../../../../app/models/RequestStatus';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/models/Application';
import { RequestLocal } from 'src/app/models/RequestLocal';

@Component({
  selector: 'app-settings-local-request-creator',
  templateUrl: './settings-local-request-creator.component.html',
  styleUrls: ['./settings-local-request-creator.component.css']
})
export class SettingsLocalRequestCreatorComponent implements OnInit {

  constructor(private activeRouter: ActivatedRoute, private router: Router, private localRequestService: RequestService, private applicationService: ApplicationService) { }

  isEdit: boolean;

  allApplications: Application[] = []

  totalSamples = [11111];

  requestStatusValues = RequestStatus;
  requestStatusValuesKeys(): Array<string> {
    const keys = Object.keys(this.requestStatusValues);
    return keys.slice(keys.length / 2);
  }

  leForm = new FormGroup({
    code: new FormControl('',
      Validators.required),
    group: new FormControl('',
      Validators.required),
    creator: new FormControl('',
      Validators.required),
    taxonomy: new FormControl('',
      Validators.required),
    status: new FormControl('',
      Validators.required),
    application: new FormControl('',
      Validators.required)
  });

  requestFromServer = new RequestLocal();

  ngOnInit(): void {
    this.getAllAplications();
    this.activeRouter.params.subscribe(
      params => {
        if (params.id !== 'new') {
          this.getLocalRequestById(params.id);
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  private getLocalRequestById(id: number) {
    this.localRequestService.getLocalRequestById(id).subscribe(
      res => {
        this.requestFromServer = res;
        this.mountForm(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  private mountForm(request: any) {
    this.leForm.controls.code.setValue(request.requestCode);
    this.leForm.controls.group.setValue(request.group);
    this.leForm.controls.creator.setValue(request.creator);
    this.leForm.controls.taxonomy.setValue(request.taxonomy);
    this.leForm.controls.status.setValue(request.status);
    this.leForm.controls.application.setValue(request.application);
  }

  private getAllAplications(): void {
    this.applicationService.getAll().subscribe(
      res => {
        this.allApplications = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  public onFocusEvent(event, sampleNumber) {
    if (event.target.value !== '' && sampleNumber === this.totalSamples[this.totalSamples.length - 1]) {
      this.totalSamples.push(this.totalSamples[this.totalSamples.length - 1] + 1);
    } else if (event.target.value === '' && !(sampleNumber === this.totalSamples[this.totalSamples.length - 1])) {
      this.totalSamples.splice(sampleNumber - 1, 1);
      // for (let i = sampleNumber -1; i < this.totalSamples.length ;i++) {
      //   console.log(this.totalSamples[i]);
      //   this.totalSamples[i] = this.totalSamples[i] - 1;
      // }
    }
  }

  public submit(): void {
    let allSamples = '';
    const inputs = document.getElementsByClassName('lmao');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i]['value'] !== '') {
        allSamples += `${inputs[i]['value']}---`
      }
    }
    const localRequestToSend = new RequestLocal();
    localRequestToSend.id = this.requestFromServer.id;
    localRequestToSend.requestCode = this.leForm.controls.code.value;
    localRequestToSend.application = this.leForm.controls.application.value;
    localRequestToSend.creationDate = this.leForm.controls.creationDate.value;
    localRequestToSend.creator = this.leForm.controls.creator.value;
    localRequestToSend.group = this.leForm.controls.group.value;
    localRequestToSend.status = this.leForm.controls.status.value;
    localRequestToSend.taxonomy = this.leForm.controls.taxonomy.value;
    localRequestToSend.samples = allSamples;
    console.log(localRequestToSend);
    


  } 

}
