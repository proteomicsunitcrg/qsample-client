import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  constructor(private httpClient: HttpClient) {}

  public confirmPasswordValidator(control: FormControl): ValidationErrors | null {
    if (!control.parent || !control) {
      return null;
    }

    const password = control.parent.get('password')?.value;
    const confirmPassword = control.value;

    if (confirmPassword !== password) {
      return { notSame: true };
    }

    return null;
  }
}
