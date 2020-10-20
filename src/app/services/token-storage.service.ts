import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public isInternalUser(): boolean {
    let internal = false;
    const token = this.getUser();
    if (token == null) {
      return;
    }
    token.roles.forEach(element => {
      if (element === 'ROLE_INTERNAL') {
        internal = true;
      }
    });
    return internal;
  }

  public isAdminUser(): boolean {
    let admin = false;
    const token = this.getUser();
    if (token == null) {
      return;
    }
    token.roles.forEach(element => {
      if (element === 'ROLE_ADMIN') {
        admin = true;
      }
    });
    return admin;
  }


  public isManagerUser(): boolean {
    let admin = false;
    const token = this.getUser();
    if (token == null) {
      return;
    }
    token.roles.forEach(element => {
      if (element === 'ROLE_MANAGER') {
        admin = true;
      }
    });
    return admin;
  }

  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

}
