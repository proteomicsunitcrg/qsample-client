import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-user',
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.css'],
})
export class SettingsUserComponent implements OnInit {
  dataSource: MatTableDataSource<any>;

  columnsToDisplay = ['username', 'firstname', 'lastname', 'groupp', 'roles', 'permissions', 'remove'];

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.userService.getAllUsers().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(this.rolesMapping(res));
        this.allUsers = res;
        // console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  allUsers: User[] = [];

  ngOnInit(): void {}

  public openDialog(user: User): void {
    const dialogRef = this.dialog.open(UserSettingDialogComponent, {
      data: {
        user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      window.location.reload(); // Prompted reload for getting new permissions from table
    });
  }

  public removeDialog(user: User): void {
    const dialogRef = this.dialog.open(UserRemoveDialogComponent, {
      data: {
        user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      window.location.reload(); // Prompted reload for getting new permissions from table
    });
  }

  // Function for mapping roles to easier to understand profiles
  private rolesMapping(users: User[]): User[] {
    let modifUsers = [];

    for (let u of users) {
      u.profile = 'External';
      for (let r of u.roles) {
        if (r.name == 'ROLE_EXTERNAL') {
          u.profile = 'External';
          break;
        }
        if (r.name == 'ROLE_INTERNAL') {
          u.profile = 'Internal';
        }
        if (r.name == 'ROLE_ADMIN' || r.name == 'ROLE_MANAGER') {
          u.profile = 'Lab Manager';
          break;
        }
      }
      modifUsers.push(u);
    }

    return modifUsers;
  }
}

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
})
export class UserSettingDialogComponent {
  user: User;
  constructor(
    @Inject(MAT_DIALOG_DATA) public userC: any,
    private userService: UserService
  ) {
    this.user = userC.user;
    this.getMainRole();
  }

  isInternal: boolean;
  isExternal: boolean;
  isManager: boolean;

  private getMainRole(): void {
    for (const role of this.user.roles) {
      if (role.name === 'ROLE_INTERNAL') {
        this.isInternal = true;
        this.isExternal = false;
      }
      if (role.name === 'ROLE_EXTERNAL') {
        this.isExternal = true;
        this.isInternal = false;
        break;
      }
      if (role.name === 'ROLE_ADMIN' || role.name === 'ROLE_MANAGER') {
        this.isManager = true;
        this.isExternal = false;
        this.isInternal = true;
        break;
      }
    }
  }

  public modifyRole(to: string): void {
    this.userService.modifyRole(this.user, to).subscribe(
      (res) => {
        // Hack a bit for internal. Could be nicer
        if (to == 'internal') {
          this.isManager = false;
        }
        this.user = res;
        this.getMainRole();
      },
      (err) => {
        alert(err.error.message + ' Console and server logs to get more info');
        console.error(err);
      }
    );
  }
}

@Component({
  selector: 'app-dialog-content-remove-dialog',
  templateUrl: './dialog-content-remove-dialog.html',
  styleUrls: ['./settings-user.component.css'],
})
export class UserRemoveDialogComponent {
  user: User;
  constructor(
    @Inject(MAT_DIALOG_DATA) public userC: any,
    private userService: UserService
  ) {
    this.user = userC.user;
  }

  public removeUser(): void {
    this.userService.deleteUser(this.user).subscribe(
      (res) => {
        // console.log(res);
        window.location.reload(); // Prompted reload for getting new permissions from table
      },
      (err) => {
        alert(err.error.message);
        console.error(err);
      }
    );
  }
}
