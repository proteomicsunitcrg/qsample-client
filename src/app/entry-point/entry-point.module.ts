import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryPointRouterModule } from './entry-point-router/entry-point-router.module';
import { AngularMaterialModule } from '../angular-material.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    EntryPointRouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  declarations: [
    LoginFormComponent,
  ],
  providers: [
  ],
  bootstrap: []
})
export class EntryPointModule { }
