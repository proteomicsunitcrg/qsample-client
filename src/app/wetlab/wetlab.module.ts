import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { WetlabMainComponent } from './wetlab-main/wetlab-main.component';
import { WetlabDetailsComponent } from './wetlab-details/wetlab-details.component';
import { WetlabRouter } from './wetlab.router';
import { WetlabPlotComponent } from './wetlab-plot/wetlab-plot.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataService } from '../services/data.service';


@NgModule({
  declarations: [
    WetlabMainComponent,
    WetlabDetailsComponent,
    WetlabPlotComponent
    ],
  imports: [
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    WetlabRouter
  ],
  providers: [
    DataService
  ],
  bootstrap: []
})
export class WetLabModule { }
