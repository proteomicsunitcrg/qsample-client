import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service';
import { SettingsMainComponent } from './settings-main/settings-main.component';
import { SettingsUserComponent } from './settings-user/settings-user.component';
import { SettingsQgeneratorSystemsComponent } from './system/settings-qgenerator-systems/settings-qgenerator-systems.component';
// tslint:disable-next-line:max-line-length
import { SettingsQgeneratorApplicationsComponent } from './application/settings-qgenerator-applications/settings-qgenerator-applications.component';
// tslint:disable-next-line:max-line-length
import { SettingsQgeneratorSystemsCreatorComponent } from './system/settings-qgenerator-systems-creator/settings-qgenerator-systems-creator.component';
// tslint:disable-next-line:max-line-length
import { SettingsQgeneratorApplicationsCreatorComponent } from './application/settings-qgenerator-applications-creator/settings-qgenerator-applications-creator.component';
import { SettingsQgeneratorMethodsComponent } from './method/settings-qgenerator-methods/settings-qgenerator-methods.component';
import { SettingsQgeneratorMethodsCreatorComponent } from './method/settings-qgenerator-methods-creator/settings-qgenerator-methods-creator.component';
import { SettingsQgeneratorSystemsQcComponent } from './system/settings-qgenerator-systems-qc/settings-qgenerator-systems-qc.component';
import { SettingsLocalRequestComponent } from './local/settings-local-request/settings-local-request.component';
import { SettingsLocalRequestCreatorComponent } from './local/settings-local-request-creator/settings-local-request-creator.component';

const routes: Routes = [
  {
    path: '', component: SettingsMainComponent, canActivate: [RoleGuard]
    , children: [
      { path: 'user', component: SettingsUserComponent },
      { path: 'QGenerator/systems', component: SettingsQgeneratorSystemsComponent },
      { path: 'QGenerator/systems/editor/:id', component: SettingsQgeneratorSystemsCreatorComponent },
      { path: 'QGenerator/systems/qc/:id', component: SettingsQgeneratorSystemsQcComponent },
      { path: 'QGenerator/applications', component: SettingsQgeneratorApplicationsComponent },
      { path: 'QGenerator/applications/editor/:id', component: SettingsQgeneratorApplicationsCreatorComponent },
      { path: 'QGenerator/methods', component: SettingsQgeneratorMethodsComponent },
      { path: 'QGenerator/methods/editor/:id', component: SettingsQgeneratorMethodsCreatorComponent },
      { path: 'local/request', component: SettingsLocalRequestComponent },
      { path: 'local/request/editor/:id', component: SettingsLocalRequestCreatorComponent },

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
