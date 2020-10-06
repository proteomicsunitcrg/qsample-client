import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service';
import { SettingsMainComponent } from './settings-main/settings-main.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';

const routes: Routes = [
  {
    path: '', component: SettingsMainComponent, canActivate: [RoleGuard]
    , children: [
      { path: 'user', component: SettingsUserComponent },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class SettingsRouter { }
