import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-adduser',
  templateUrl: './settings-adduser.component.html',
  styleUrls: ['./settings-adduser.component.css']
})
export class SettingsAddUserComponent implements OnInit {

  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
  }

}
