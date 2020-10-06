import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { WetlabMainComponent } from './wetlab-main/wetlab-main.component';
import { WetlabDetailsComponent } from './wetlab-details/wetlab-details.component';
import { WetlabRouter } from './wetlab.router';
import { WetlabPlotComponent } from './wetlab-plot/wetlab-plot.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataService } from '../services/data.service';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GuidesetMainComponent } from './guideset-main/guideset-main.component';
import { GuidesetService } from '../services/guideset.service';
import { ThresholdService } from '../services/threshold.service';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    WetlabMainComponent,
    WetlabDetailsComponent,
    // WetlabPlotComponent,
    DateSelectorComponent,
    GuidesetMainComponent
  ],
  imports: [
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    WetlabRouter,
    SharedModule
  ],
  providers: [
    GuidesetService,
    { provide: MAT_DATE_LOCALE, useValue: 'es' },

  ],
  bootstrap: []
})
export class WetLabModule { }
