import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserCreation } from '../../models/UserCreation';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'app-settings-adduser',
  templateUrl: './settings-adduser.component.html',
  styleUrls: ['./settings-adduser.component.css'],
})
export class SettingsAddUserComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private functionsService: FunctionsService,
    private snackBar: MatSnackBar
  ) {}

  dataSource: MatTableDataSource<any>;

  ucForm = new FormGroup({
    firstname: new FormControl('', [Validators.minLength(1), Validators.required]),
    lastname: new FormControl('', [Validators.minLength(1), Validators.required]),
    username: new FormControl('', [Validators.email, Validators.required]),
    groupp: new FormControl(''),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
    confirmpassword: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
      this.functionsService.confirmPasswordValidator,
    ]),
  });

  ngOnInit(): void {}

  private trimValue(value: string): string {
    let newValue = value;
    if (newValue) {
      newValue = newValue.trim();
    }
    return newValue;
  }

  public submit(): void {
    let firstname = this.trimValue(this.ucForm.controls.firstname.value);
    let lastname = this.trimValue(this.ucForm.controls.lastname.value);
    let username = this.trimValue(this.ucForm.controls.username.value);
    let password = this.trimValue(this.ucForm.controls.password.value);
    let groupp = null;
    if (this.ucForm.controls.groupp.value && this.ucForm.controls.groupp.value.trim().length > 0) {
      groupp = this.trimValue(this.ucForm.controls.groupp.value);
    }

    const userToSend = new UserCreation(firstname, lastname, username, password, groupp);
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

  public goBack(): void {
    this.router.navigate(['/settings/user']);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
