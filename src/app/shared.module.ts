import { NgModule } from '@angular/core';
import { WetlabPlotComponent } from './wetlab/wetlab-plot/wetlab-plot.component';
import { CommonModule } from '@angular/common';
import { RequestsListComponent } from './page/requests/requests-list/requests-list.component';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [CommonModule, AngularMaterialModule, FormsModule, ReactiveFormsModule, FlexLayoutModule],
  declarations: [WetlabPlotComponent, RequestsListComponent],
  exports: [WetlabPlotComponent, RequestsListComponent]
})
export class SharedModule { }
