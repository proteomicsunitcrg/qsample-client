import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  error = '';
  loginForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60),
    ])
  });

  username = '';

  token = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.token = params.token;
        this.checkToken();
    });
  }

  public changePwd(): void {
    console.log(this.token);

  }

  private checkToken(): void {
    this.authService.checkResetPasswordToken(this.token).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
  }


}
