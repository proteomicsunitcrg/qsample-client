import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWindowComponent } from './main-window/main-window.component';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

// const routes: Routes = [
//   {
//     path: 'lul', component: MainWindowComponent
//   },
// ];
const routes: Routes = [
    {
      path: '', component: MainWindowComponent, children: [
        { path: '', component: WelcomeComponent }
        // { path: 'systems', component: MainSystemComponent},
        // { path: 'thresholds', component: MainThresholdComponent}
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