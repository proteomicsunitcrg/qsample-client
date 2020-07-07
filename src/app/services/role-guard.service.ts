import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot
  } from '@angular/router';
import { AuthService } from './auth.service';
import * as decode from 'jwt-decode';
import { TokenStorageService } from './token-storage.service';


@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(public auth: AuthService, public router: Router, private tokenService: TokenStorageService) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const token = this.tokenService.getToken();
        if (token === null) {
          this.router.navigate(['login']);
          return false;
        }
        const tokenPayload = decode(token);
        if (tokenPayload.exp > Date.now()) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      }


}