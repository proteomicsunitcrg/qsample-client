import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WetlabMainComponent } from './wetlab-main/wetlab-main.component';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service'
import { WetlabDetailsComponent } from './wetlab-details/wetlab-details.component';
import { GuidesetMainComponent } from './guideset-main/guideset-main.component';

const routes: Routes = [
  {
    path: 'plot', component: WetlabMainComponent, canActivate: [RoleGuard], children: [
        { path: ':apiKey', component: WetlabDetailsComponent },
        // { path: 'guideset', component: GuidesetMainComponent}
    ]
  },
  {
    path: 'guideset', component: GuidesetMainComponent, canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class WetlabRouter { }
