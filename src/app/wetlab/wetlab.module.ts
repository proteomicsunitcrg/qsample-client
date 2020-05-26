import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { WetlabMainComponent } from './wetlab-main/wetlab-main.component';
import { WetlabDetailsComponent } from './wetlab-details/wetlab-details.component';
import { WetlabRouter } from './wetlab.router';


@NgModule({
  declarations: [
    WetlabMainComponent,
    WetlabDetailsComponent
    ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    WetlabRouter
  ],
  providers: [
  ],
  bootstrap: []
})
export class WetLabModule { }
