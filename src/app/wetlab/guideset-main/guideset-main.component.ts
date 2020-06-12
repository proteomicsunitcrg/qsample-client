import { Component, OnInit } from '@angular/core';
import { WetLabService } from '../../services/wetlab.service';
import { WetLab } from '../../models/WetLab';
import { FileService } from '../../services/file.service';
import { File } from '../../models/File';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { GuidesetService } from '../../services/guideset.service';
import { Guideset } from '../../models/Guideset';

@Component({
  selector: 'app-guideset-main',
  templateUrl: './guideset-main.component.html',
  styleUrls: ['./guideset-main.component.css']
})
export class GuidesetMainComponent implements OnInit {

  constructor(private wetLabService: WetLabService, private fileService: FileService, private router: Router, private guidesetService: GuidesetService) { }

  allWetLabs: WetLab[];

  wetLabFiles: File[];

  selectedFiles: File[] = [];

  selectedWetlab: WetLab;

  setedGuideset: Guideset;

  guideSetExists = true;


  ngOnInit(): void {
    this.getAllWetlabs();
  }

  private getAllWetlabs(): void {
    this.wetLabService.getWetlabLists().subscribe(
      res => {
        console.log(res);
        this.allWetLabs = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  public getFiles(wetlab: WetLab): void {
    this.selectedWetlab = wetlab;
    this.fileService.getWetLabFilesByWetLabApiKey(wetlab.apiKey).subscribe(
      res => {
        console.log(res);
        this.wetLabFiles = res;
        this.getGuideSet();
      },
      err => {
        console.error(err);
      }
    );
  }

  public cleanArray(): void {
    this.selectedWetlab = null;
    this.wetLabFiles = [];
  }

  public setGuideset(): void {
    console.log(this.selectedWetlab);
    console.log(this.selectedFiles);
    this.guidesetService.setGuideset(this.selectedWetlab, this.selectedFiles).subscribe(
      res => {
        this.getGuideSet();
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
  }

  public updateList(file: File, $event: MatCheckboxChange) {
    if ($event.checked) {
      this.selectedFiles.push(file);
    } else {
      this.selectedFiles.splice(this.selectedFiles.indexOf(file),1);
    }
    console.log(this.selectedFiles);
  }

  public getGuideSet(): void {
    this.guidesetService.getGuidesetByWetlabApiKey(this.selectedWetlab).subscribe(
      res => {
        this.setedGuideset = res;
        // if (this.setedGuideset != null) {
        //   this.i
        // }
      },
      err => {
        console.log(err);
      }
    );
  }

  public deleteGuideSet(): void {
    this.guidesetService.deleteGuideset(this.setedGuideset).subscribe(
      res => {
        console.log(res);
        this.getGuideSet();
      },
      err => {
        console.error(err);
      }
    );
  }

  public goBack(): void {
    this.router.navigate(['/application']);

  }

}
