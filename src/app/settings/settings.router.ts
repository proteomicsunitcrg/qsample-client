import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service';
import { SettingsMainComponent } from './settings-main/settings-main.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { SettingsQgeneratorSystemsComponent } from './settings-qgenerator-systems/settings-qgenerator-systems.component';
import { SettingsQgeneratorApplicationsComponent } from './settings-qgenerator-applications/settings-qgenerator-applications.component';
import { SettingsQgeneratorMethodsComponent } from './settings-qgenerator-methods/settings-qgenerator-methods.component';
import { SettingsQgeneratorSystemsCreatorComponent } from './settings-qgenerator-systems-creator/settings-qgenerator-systems-creator.component';

const routes: Routes = [
  {
    path: '', component: SettingsMainComponent, canActivate: [RoleGuard]
    , children: [
      { path: 'user', component: SettingsUserComponent },
      { path: 'QGenerator/systems', component: SettingsQgeneratorSystemsComponent },
      { path: 'QGenerator/systems/editor/:id', component: SettingsQgeneratorSystemsCreatorComponent },
      { path: 'QGenerator/applications', component: SettingsQgeneratorApplicationsComponent },
      { path: 'QGenerator/methods', component: SettingsQgeneratorMethodsComponent },

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
