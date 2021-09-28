import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css']
})
export class DashboardMainComponent implements OnInit {

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.checkEnabledNextflowModule();
  }

  isNexFlowDisabled = true;


  private checkEnabledNextflowModule(): void {
    this.fileService.getIsNextflowModuleEnabled().subscribe(
      res => {
        this.isNexFlowDisabled = res;
      },
      err => {
        console.error(err);
      }
    );
  }

}
