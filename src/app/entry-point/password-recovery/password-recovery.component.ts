import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PasswordResetToken } from 'src/app/models/PasswordResetToken';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router,
              private snackBar: MatSnackBar, private tokenService: TokenStorageService) { }

  error = '';
  loginForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60),
    ])
  });

  username = '';

  token: PasswordResetToken;

  tokenFromUrl = '';

  ngOnInit(): void {
    this.logout();
    this.route.queryParams.subscribe(
      params => {
        this.tokenFromUrl = params.token;
        this.checkToken();
    });
  }

  public changePwd(): void {
    this.authService.changePassword(this.token.user.username, this.loginForm.value.password).subscribe(
      res => {
        this.openSnackBar('Password changed', 'Close');
        this.router.navigate(['/login']);
      },
      err => {
        this.openSnackBar('Error, contact the admins', 'Close');
        this.router.navigate(['/login']);
        console.error(err);      
      }
    );
  }

  private checkToken(): void {
    
    this.authService.getResetToken(this.tokenFromUrl).subscribe(
      res => {
        this.token = res;
        this.username = this.token.user.username;
      },
      err => {
        this.openSnackBar('Token not found', 'Close');
        this.router.navigate(['/login']);
        console.error(err);
      }
    );
  }

  private logout(): void {
    this.tokenService.signOut();
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }


}
