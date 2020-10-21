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
import { SettingsQgeneratorApplicationsComponent } from './application/settings-qgenerator-applications/settings-qgenerator-applications.component';
import { SettingsQgeneratorSystemsCreatorComponent } from './system/settings-qgenerator-systems-creator/settings-qgenerator-systems-creator.component';
import { SettingsQgeneratorApplicationsCreatorComponent } from './application/settings-qgenerator-applications-creator/settings-qgenerator-applications-creator.component';
import { InjectionConditionsDialog } from './system/settings-qgenerator-systems-creator/dialog/injection-conditions-dialog.component';


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
        InjectionConditionsDialog
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
