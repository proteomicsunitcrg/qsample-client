import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared.module';
import { SettingsMainComponent } from './settings-main/settings-main.component';
import { SettingsRouter } from './settings.router';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { SettingsUserComponent, UserSettingDialogComponent } from './settings-user/settings-user.component';
import { SettingsQgeneratorSystemsComponent } from './system/settings-qgenerator-systems/settings-qgenerator-systems.component';
// tslint:disable-next-line:max-line-length
import { SettingsQgeneratorApplicationsComponent } from './application/settings-qgenerator-applications/settings-qgenerator-applications.component';
// tslint:disable-next-line:max-line-length
import { SettingsQgeneratorSystemsCreatorComponent } from './system/settings-qgenerator-systems-creator/settings-qgenerator-systems-creator.component';
// tslint:disable-next-line:max-line-length
import { SettingsQgeneratorApplicationsCreatorComponent } from './application/settings-qgenerator-applications-creator/settings-qgenerator-applications-creator.component';
// tslint:disable-next-line:max-line-length
import { InjectionConditionsDialogComponent } from './system/settings-qgenerator-systems-creator/dialog/injection-conditions-dialog.component';
import { SettingsQgeneratorMethodsComponent } from './method/settings-qgenerator-methods/settings-qgenerator-methods.component';
import { SettingsQgeneratorMethodsCreatorComponent } from './method/settings-qgenerator-methods-creator/settings-qgenerator-methods-creator.component';
import { SettingsQgeneratorSystemsQcComponent } from './system/settings-qgenerator-systems-qc/settings-qgenerator-systems-qc.component';
import { InjectionConditionsQCDialogComponent } from './system/settings-qgenerator-systems-qc/dialog/injection-conditions-dialog-qc.component';


@NgModule({
  declarations: [
    SettingsMainComponent,
    SettingsSidebarComponent,
    SettingsUserComponent,
    UserSettingDialogComponent,
    SettingsQgeneratorSystemsComponent,
    SettingsQgeneratorApplicationsComponent,
    SettingsQgeneratorSystemsCreatorComponent,
    SettingsQgeneratorApplicationsCreatorComponent,
    InjectionConditionsDialogComponent,
    InjectionConditionsQCDialogComponent,
    SettingsQgeneratorMethodsComponent,
    SettingsQgeneratorMethodsCreatorComponent,
    SettingsQgeneratorSystemsQcComponent
  ],
  imports: [
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,
    SettingsRouter
  ],
  providers: [
  ],
  bootstrap: []
})
export class SettingsModule { }
