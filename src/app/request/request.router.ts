import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service';
import { RequestMainComponent } from './request-main/request-main.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { RequestQueueGeneratorComponent } from './request-queue-generator/request-queue-generator.component';

const routes: Routes = [
  {
    path: '',
    component: RequestMainComponent,
    canActivate: [RoleGuard],
    children: [
      {
        path: ':apiKey',
        component: RequestDetailsComponent,
      },
      {
        // TODO: Reconsider here with request id
        path: 'QGenerator/:apiKey',
        component: RequestQueueGeneratorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class RequestRouter {}
