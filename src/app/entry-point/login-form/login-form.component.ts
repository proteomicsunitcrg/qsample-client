import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  error = "";
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(60),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60),
    ])
  });
  isLoggedIn = false;
  roles: string[] = [];
  constructor(private elementRef: ElementRef, private authService: AuthService, private tokenService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenService.getUser().roles;
      this.navigate();
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'grey';
  }

  public logIn(): void {
    console.log(this.loginForm.value.username, this.loginForm.value.password);
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      res => {
        this.tokenService.saveToken(res.accessToken);
        this.tokenService.saveUser(res)
        this.isLoggedIn = true;
        this.roles = this.tokenService.getUser().roles;
        this.navigate();
      },
      err => {
        console.error(err);
        switch (err.error.status) {
          case 401:
            this.error = "Bad credentials";
            break;
          case 500:
            this.error = "Internal error";
            break
          case 408:
            this.error = "Request timeout";
            break;
          case 418:
            this.error = "Agendo Error";
            break;
          default:
            this.error = "Unable to connect to QSample"
            break;
        }
      }
    );
  }

  private navigate(): void {
    this.router.navigate(['/application']);
  }

}
