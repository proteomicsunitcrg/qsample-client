import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WetlabMainComponent } from './wetlab-main/wetlab-main.component';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service'
import { WetlabDetailsComponent } from './wetlab-details/wetlab-details.component';

const routes: Routes = [
  {
    path: '', component: WetlabMainComponent, canActivate: [RoleGuard], children: [
        { path: ':apiKey', component: WetlabDetailsComponent }
    ]
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
