import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.css']
})
export class SettingsUserComponent implements OnInit {

  dataSource: MatTableDataSource<any>;

  columnsToDisplay = ['username', 'firstname', 'lastname', 'agendoId'];


  constructor(private userService: UserService) {
    this.userService.getAllUsers().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.allUsers = res;
        console.log(res);

      },
      err => {
        console.error(err);
      }
    );
  }

  allUsers: User[] = []

  ngOnInit(): void {
  }

}
