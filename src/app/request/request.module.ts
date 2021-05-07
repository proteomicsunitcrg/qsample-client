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
import { RequestQueueGeneratorComponent } from './request-queue-generator/request-queue-generator.component';
import { QGeneratorDialogComponent } from './request-queue-generator/dialog/QGeneratorDialog.component';
import { RequestPanelDialogComponent } from './request-details-panel/dialog/request-panel-dialog.component';
import { RequestDetailsPanelComponent } from './request-details-panel/request-details-panel.component';
import { NonConformitiesDialogComponent } from './request-qcloud2-files/dialog/non-conformities-dialog.component';
import { RequestPlotFileListComponent } from './request-details/request-plot-file-list/request-plot-file-list.component';
import { RequestFileUploaderComponent } from './request-file-uploader/request-file-uploader.component';
import { RequestQuantificationComponent } from './request-details/request-quantification/request-quantification.component';
import { RequestHeatmapComponent } from './request-details/request-heatmap/request-heatmap.component';
import { RequestPcaComponent } from './request-pca/request-pca.component';

@NgModule({
  declarations: [
    RequestMainComponent,
    RequestDetailsComponent,
    RequestQcloud2FilesComponent,
    RequestWetlabMainComponent,
    RequestPlotRequestComponent,
    RequestPlotPlotComponent,
    RequestQueueGeneratorComponent,
    QGeneratorDialogComponent,
    RequestPanelDialogComponent,
    RequestDetailsPanelComponent,
    NonConformitiesDialogComponent,
    RequestPlotFileListComponent,
    RequestFileUploaderComponent,
    RequestQuantificationComponent,
    RequestHeatmapComponent,
    RequestPcaComponent
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
