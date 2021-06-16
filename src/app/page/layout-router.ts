import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWindowComponent } from './main-window/main-window.component';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {
    path: '', component: MainWindowComponent, children: [
      { path: '', component: HomePageComponent },
      {
        path: 'wetlab', loadChildren: () => import('../wetlab/wetlab.module')
          .then(m => m.WetLabModule)
      },
      {
        path: 'request', loadChildren: () => import('../request/request.module')
          .then(m => m.RequestModule)
      },
      {
        path: 'settings', loadChildren: () => import('../settings/settings.module')
          .then(m => m.SettingsModule)
      },
      {
        path: 'help', loadChildren: () => import('../help/help.module')
          .then(m => m.HelpModule)
      },
      {
        path: 'favorite', loadChildren: () => import('../favorite/favorite.module')
          .then(m => m.FavoriteModule)
      }
    ]
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [],

})
export class LayoutRouterModule { }
