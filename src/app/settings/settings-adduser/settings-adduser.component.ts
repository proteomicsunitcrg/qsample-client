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

  ucForm = new FormGroup(
    {
      firstname: new FormControl('', [Validators.minLength(1), Validators.required]),
      lastname: new FormControl('', [Validators.minLength(1), Validators.required]),
      username: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      confirmpassword: new FormControl('', [Validators.minLength(6), Validators.required]),
    },
    // TODO: Add password match validator
    // { validators: this.passwordMatchValidator }
    //
  );

  ngOnInit(): void {}

  public submit(): void {
    let firstname = this.ucForm.controls.firstname.value;
    let lastname = this.ucForm.controls.lastname.value;
    let username = this.ucForm.controls.username.value;
    let password = this.ucForm.controls.password.value;

    const userToSend = new UserCreation(firstname, lastname, username, password);
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
