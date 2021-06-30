import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordRecoveryComponent } from '../password-recovery/password-recovery.component';

const routes: Routes = [
  { path: '', component: LoginFormComponent },
  { path: 'recovery', component: PasswordRecoveryComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class EntryPointRouterModule { }
