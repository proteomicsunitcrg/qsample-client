import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service';
import { HelpMainComponent } from './help-main/help-main.component';
import { QgeneratorCsvHelpComponent } from './qgenerator/qgenerator-csv-help/qgenerator-csv-help.component';


const routes: Routes = [
  {
    path: '', component: HelpMainComponent, canActivate: [RoleGuard], children: [
      { path: 'QGenerator', component: QgeneratorCsvHelpComponent },

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
export class HelpRouter { }
