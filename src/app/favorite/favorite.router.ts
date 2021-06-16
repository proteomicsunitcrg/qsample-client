import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../services/role-guard.service';
import { FavoriteMainComponent } from './favorite-main/favorite-main.component';

const routes: Routes = [
  {
    path: '', component: FavoriteMainComponent, canActivate: [RoleGuard]
    , children: [

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
export class FavoriteRouter { }
