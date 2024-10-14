import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginCustomComponent } from './login-custom/login-custom.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryPointRouterModule } from './entry-point-router/entry-point-router.module';
import { AngularMaterialModule } from '../angular-material.module';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    EntryPointRouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  declarations: [LoginCustomComponent, LoginFormComponent, PasswordRecoveryComponent],
  providers: [],
  bootstrap: [],
})
export class EntryPointModule {}
