import { Component, OnInit } from '@angular/core';
import { FileService } from '../../../services/file.service';
import { WetLabType } from '../../../models/WetLabType';

@Component({
  selector: 'app-wetlab-list',
  templateUrl: './wetlab-list.component.html',
  styleUrls: ['./wetlab-list.component.css']
})
export class WetlabListComponent implements OnInit {

  constructor(private fileService: FileService) { }

  wetLabTypes: WetLabType;

  ngOnInit(): void {
    this.getAllWetlabs();
  }

  private getAllWetlabs() {
    this.fileService.getWetlabLists().subscribe(
      res => {
        console.log(res);
        this.wetLabTypes = res;
      },
      err => {
        console.error(err);
      }
    );
  }

}
