import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared.module';
import { HelpRouter } from './help.router';
import { HelpMainComponent } from './help-main/help-main.component';
import { HelpSidebarComponent } from './help-sidebar/help-sidebar.component';
import { QgeneratorCsvHelpComponent } from './qgenerator/qgenerator-csv-help/qgenerator-csv-help.component';




@NgModule({
    declarations: [
    HelpMainComponent,
    HelpSidebarComponent,
    QgeneratorCsvHelpComponent
  ],
    imports: [
        FlexLayoutModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        SharedModule,
        HelpRouter
    ],
    providers: [
    ],
    bootstrap: []
})
export class HelpModule { }
