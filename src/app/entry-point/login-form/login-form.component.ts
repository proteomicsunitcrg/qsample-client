import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  error = '';
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(60),
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60),
    ])
  });
  isLoggedIn = false;
  roles: string[] = [];
  constructor(private elementRef: ElementRef, private authService: AuthService,
    private tokenService: TokenStorageService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenService.getUser().roles;
      this.navigate();
    }
  }

  public logIn(): void {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      res => {
        this.tokenService.saveToken(res.accessToken);
        this.tokenService.saveUser(res);
        this.isLoggedIn = true;
        this.roles = this.tokenService.getUser().roles;
        this.navigate();
      },
      err => {
        console.error(err.status);
        switch (err.status) {
          case 401:
            this.error = 'Bad credentials';
            break;
          case 500:
            this.error = 'Internal error';
            break;
          case 408:
            this.error = 'Request timeout';
            break;
          case 418:
            this.error = 'Agendo Error';
            break;
          default:
            this.error = 'Unable to connect to QSample';
            break;
        }
      }
    );
  }

  public recoverPassword(): void {
    const username = this.loginForm.value.username;
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (username === '' || username === null || username === undefined) {
      this.openSnackBar('Please fill the username field', 'Close', 5000);
      return;
    }
    if (!regexp.test(username)) {
      this.openSnackBar('Email format not valid', 'Close', 5000);
      return;
    }

    this.authService.resetPassword(username).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.error(err)
      }
    );
  }

  private navigate(): void {
    this.router.navigate(['']);
  }

  private openSnackBar(message: string, action: string, duration): void {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }

}
