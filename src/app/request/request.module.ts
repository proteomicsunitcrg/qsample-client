import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { RequestRouter } from './request.router';
import { RequestMainComponent } from './request-main/request-main.component';
import { RequestQcloud2FilesComponent } from './request-qcloud2-files/request-qcloud2-files.component';
import { RequestWetlabMainComponent } from './request-wetlab-main/request-wetlab-main.component';
import { WetlabPlotComponent } from '../wetlab/wetlab-plot/wetlab-plot.component';
import { SharedModule } from '../shared.module';
import { RequestPlotRequestComponent } from './request-plot-request/request-plot-request.component';
import { RequestPlotPlotComponent } from './request-plot-plot/request-plot-plot.component';

@NgModule({
  declarations: [
  RequestMainComponent,
  RequestDetailsComponent,
  RequestQcloud2FilesComponent,
  RequestWetlabMainComponent,
  RequestPlotRequestComponent,
  RequestPlotPlotComponent,
],
  imports: [
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RequestRouter,
    RouterModule,
    SharedModule
  ],
  providers: [


  ],
  bootstrap: []
})
export class RequestModule { }
