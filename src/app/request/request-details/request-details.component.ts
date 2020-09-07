import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private activeRouter: ActivatedRoute, private requestService: RequestService) {
    this.subscription = this.authService.getIsInternal().subscribe(res => this.isInternal = res);
    this.activeRouter.params.subscribe(
      params => {
        this.requestId = params.apiKey;
        this.requestService.getRequestDetails(params.apiKey).subscribe(
          res => {
            console.log(res);
            this.request = res;
            this.requestCode = this.getRequestCodeFromRequest(this.request);
            console.log(this.request);

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

  realRequest = {
    "id": 171,
    "created_by": {
      "id": 24,
      "name": "Eduard Sabid&oacute;",
      "email": "eduard.sabido@crg.cat"
    },
    "group": "Proteomics",
    "class": "SILAC: Proteome quantification",
    "date_created": "2019-01-02 13:53:06",
    "status": null,
    "account": "No account",
    "total": "0.0000",
    "delivery_date": null,
    "delivery_location": null,
    "comment": "",
    "last_action": {
      "user": {
        "id": 24,
        "name": "Eduard Sabid&oacute;",
        "email": "eduard.sabido@crg.cat"
      },
      "date": "2019-03-22 14:46:51",
      "action": "Rejected"
    },
    "products": [],
    "fields": [
      {
        "id": 351,
        "name": "Order number",
        "value": "1"
      },
      {
        "id": 340,
        "name": "Number of samples",
        "value": "4"
      },
      {
        "id": 337,
        "name": "I have at least 10 micrograms of total protein per sample",
        "value": "on"
      },
      {
        "id": 367,
        "name": "I have at least 95 % heavy amino acid (SILAC) incorporation",
        "value": "on"
      },
      {
        "id": 338,
        "name": "I do have at least 3 replicates per condition",
        "value": "on"
      },
      {
        "id": 339,
        "name": "Experimental design",
        "value": "555"
      },
      {
        "id": 336,
        "name": "Taxonomy",
        "value": "Escherichia coli"
      },
      {
        "id": 342,
        "name": "Sample delivery",
        "value": "Protein extract in 6M Urea + 200 mM Ammonium bicarbonate at 1 &micro;g/&micro;L"
      },
      {
        "id": 366,
        "name": "SILAC Labels",
        "value": "Lys+8;Arg+10"
      },
      {
        "id": 341,
        "name": "Raw data acquisition only",
        "value": "0"
      },
      {
        "id": 348,
        "name": "I confirm that my samples are not radioactive nor they contain potentially dangerous agents for human health ",
        "value": "on"
      },
      {
        "id": 346,
        "name": "Amount digested",
        "value": "10 &micro;g"
      },
      {
        "id": 994,
        "name": "Enzyme",
        "value": "1"
      },
      {
        "id": 373,
        "name": "Sample preparation protocol",
        "value": "1"
      },
      {
        "id": 371,
        "name": "Amount injected",
        "value": "1"
      },
      {
        "id": 343,
        "name": "Instrument",
        "value": "Orbitrap Fusion Lumos"
      },
      {
        "id": 350,
        "name": "Acquisition method",
        "value": "STD-FL-DDA-90min-TSP-HCD-IT"
      },
      {
        "id": 345,
        "name": "Data analysis ",
        "value": "Proteome Discoverer v2.0"
      },
      {
        "id": 349,
        "name": "Data analysis workflow",
        "value": "STD-PWF-MASCOT-ANY-IT-DECOY + STD-CWF-TOP3-UPG-NNM-5FDR"
      },
      {
        "id": 344,
        "name": "Search engine",
        "value": "Mascot v2.6"
      },
      {
        "id": 347,
        "name": "Database version",
        "value": "10/2018"
      },
      {
        "id": 372,
        "name": "Oracle No.",
        "value": "1"
      },
      {
        "id": 335,
        "name": "",
        "value": "[[{\"id\":19,\"value\":\"2018XB0|0|001\"},{\"id\":20,\"value\":\"Q\"},{\"id\":21,\"value\":\"1\"},{\"id\":22,\"value\":\"1\"},{\"id\":199,\"value\":\"\"},{\"id\":200,\"value\":\"\"}]]"
      }
    ]
  }

  ngOnInit(): void {

  }

  // TODO: Improve the parser. RN is a piece of shit but the AGENDO response is crap

  private getRequestCodeFromRequest(request: any): string {
    let cac = JSON.parse(request.fields[request.fields.length-1].value);
    console.log(cac[0][0].value.split('|')[0]);
    return cac[0][0].value.split('|')[0];
    // for (let element of cac[0]) {
    //   console.log(element.value);
    //   if (element.type == 9) {

    //     console.log(element.value.split('|')[0]);
    //     return element.value.split('|')[0];
    //   }
    // }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public goBack(): void {
    this.router.navigate(['']);
  }

  public goToQGenerator(): void {
    console.log('caca');

    this.router.navigate(['/request/QGenerator', this.requestId]);
  }

  // private getRequestDetails()

}
