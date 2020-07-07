import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service'
import { RequestMainComponent } from './request-main/request-main.component';
import { RequestDetailsComponent } from './request-details/request-details.component';

const routes: Routes = [
  {
    path: 'details', component: RequestMainComponent, canActivate: [RoleGuard], children: [
        { path: ':apiKey', component: RequestDetailsComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class RequestRouter { }
