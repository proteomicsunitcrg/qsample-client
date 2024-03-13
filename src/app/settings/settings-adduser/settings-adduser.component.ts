import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserCreation } from '../../models/UserCreation';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-adduser',
  templateUrl: './settings-adduser.component.html',
  styleUrls: ['./settings-adduser.component.css'],
})
export class SettingsAddUserComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  dataSource: MatTableDataSource<any>;

  ucForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
  });

  ngOnInit(): void {}

  // this.id = id;
  // this.apiKey = apiKey;
  // this.firstname = firstname;
  // this.lastname = lastname;
  // this.username = username;
  // this.agendoId = agendoId;
  // this.groupp = groupp;
  //
  //
  public submit(): void {

    let firstname = this.ucForm.controls.firstname.value;
    let lastname = this.ucForm.controls.lastname.value;
    let username = this.ucForm.controls.username.value;

    const userToSend = new UserCreation(firstname, lastname, username, '123456');
    this.userService.addUser(userToSend).subscribe(
      (res) => {
        this.openSnackBar('User added', 'Close'); // TODO: Move message
        this.router.navigate(['/settings/user']); // Back once saved
      },
      (err) => {
        this.openSnackBar('Error adding user', 'Close'); // TODO: Move message
        console.error(err);
      }
    );
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
