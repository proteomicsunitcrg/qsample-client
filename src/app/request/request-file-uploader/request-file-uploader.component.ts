import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QGeneratorService } from '../../services/qGenerator.service';

@Component({
  selector: 'app-request-file-uploader',
  templateUrl: './request-file-uploader.component.html',
  styleUrls: ['./request-file-uploader.component.css']
})
export class RequestFileUploaderComponent {

  constructor(private qGeneratorService: QGeneratorService) { }

  @ViewChild('fileInput') fileInput: ElementRef;

  csvString: any;


  uploadFileEvt(file: any) {
    if (file.target.files && file.target.files[0]) {
      // HTML5 FileReader API
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.csvString = reader.result;
        const rows = this.csvString.split('\n');
        this.sendCSVToService(rows);
      };
      reader.readAsText(file.target.files[0]);
    }
  }

  public sendCSVToService(list: any) {
    this.qGeneratorService.sendCSV(list);
  }

}
