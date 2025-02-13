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
import { RequestListYearSelectorDialog } from './requests/requests-list/dialog/request-list-year-selector-dialog';
import { DashboardRequestComponent } from './dashboard/dashboard-request/dashboard-request.component';
import { DashboardWetlabComponent } from './dashboard/dashboard-wetlab/dashboard-wetlab.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardRequestNextflowComponent } from './dashboard/dashboard-request-nextflow/dashboard-request-nextflow.component';
import { SharedModule } from '../shared.module';




@NgModule({
  imports: [
    CommonModule,
    LayoutRouterModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule
  ],
  declarations: [
    MainWindowComponent,
    TopBarComponent,
    HomePageComponent,
    MainRequestsComponent,
    
    MainWetlabComponent,
    WetlabListComponent,
    ThemeSelectorComponent,
    RequestListYearSelectorDialog,
    DashboardRequestComponent,
    DashboardWetlabComponent,
    DashboardMainComponent,
    DashboardRequestNextflowComponent,
  ],
  providers: [
    RequestService
  ]
})
export class LayoutModule { }
