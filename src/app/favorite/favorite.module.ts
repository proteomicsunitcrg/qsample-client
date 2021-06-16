import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { SharedModule } from '../shared.module';
import { FavoriteMainComponent } from './favorite-main/favorite-main.component';
import { FavoriteRouter } from './favorite.router';
import { FavoriteSidebarComponent } from './favorite-sidebar/favorite-sidebar.component';
import { FavoriteTableComponent } from './favorite-table/favorite-table.component';

@NgModule({
    declarations: [

    
    FavoriteMainComponent,
          FavoriteSidebarComponent,
          FavoriteTableComponent
  ],
    imports: [
      FlexLayoutModule,
      CommonModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      AngularMaterialModule,
      SharedModule,
      FavoriteRouter
    ],
    providers: [
    ],
    bootstrap: []
  })
  export class FavoriteModule { }