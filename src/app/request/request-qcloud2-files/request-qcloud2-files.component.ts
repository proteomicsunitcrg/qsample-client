import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { QCloud2File } from '../../models/QCloud2File';

@Component({
  selector: 'app-request-qcloud2-files',
  templateUrl: './request-qcloud2-files.component.html',
  styleUrls: ['./request-qcloud2-files.component.css']
})
export class RequestQcloud2FilesComponent implements OnInit {

  constructor(private fileService: FileService) { }

  @Input("request") request: any;

  qCloud2Files: QCloud2File[];

  ngOnInit(): void {
    this.getQCloud2Files();
  }

  private getQCloud2Files(): void {
    console.log(this.request);
    this.fileService.getQCloud2Files(this.request.request_code).subscribe(
      res => {
        this.qCloud2Files = res;
        console.log(res);

      },
      err => {
        console.error(err);
      }
    );
  }

}
