import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
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
    let manager = false;
    const token = this.getUser();
    if (token == null) {
      return;
    }
    token.roles.forEach(element => {
      if (element === 'ROLE_MANAGER') {
        manager = true;
      }
    });
    return manager;
  }

  public saveUser(user) {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

}
