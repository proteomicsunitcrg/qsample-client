import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService as RoleGuard } from './services/role-guard.service'
import { MainWindowComponent } from './page/main-window/main-window.component';
import { HomePage } from './page/home-page/home-page.component';


const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./page/layout.module').then(m => m.LayoutModule) },
  { path: 'login', loadChildren: () => import('./entry-point/entry-point.module').then(m => m.EntryPointModule) },
  // { path: '**', redirectTo: '/login', pathMatch: 'full' },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
