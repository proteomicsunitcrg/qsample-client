import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWindowComponent } from './main-window/main-window.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { LayoutRouterModule } from './layout-router';
import { HomePageComponent } from './home-page/home-page.component';
import { AngularMaterialModule } from '../angular-material.module';
import { MainRequestsComponent } from './requests/main-requests/main-requests.component';
import { RequestsListComponent } from './requests/requests-list/requests-list.component';
import { MainWetlabComponent } from './wetlab/main-wetlab/main-wetlab.component';
import { WetlabListComponent } from './wetlab/wetlab-list/wetlab-list.component';
import { RequestService } from '../services/request.service';
import { ThemeSelectorComponent } from './top-bar/theme-selector/theme-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';




@NgModule({
  imports: [
    CommonModule,
    LayoutRouterModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [
    MainWindowComponent,
    TopBarComponent,
    HomePageComponent,
    MainRequestsComponent,
    RequestsListComponent,
    MainWetlabComponent,
    WetlabListComponent,
    ThemeSelectorComponent
  ],
  providers: [
    RequestService
  ]
})
export class LayoutModule { }
