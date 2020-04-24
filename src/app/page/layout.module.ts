import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWindowComponent } from './main-window/main-window.component';
import { TopBarComponent } from './top-bar/top-bar.component'
import { LayoutRouterModule } from './layout-router';
import { HomePage } from './home-page/home-page.component';
import { AngularMaterialModule } from '../angular-material.module';
import { MainRequestsComponent } from './requests/main-requests/main-requests.component';
import { RequestsListComponent } from './requests/requests-list/requests-list.component';


@NgModule({
    imports: [
        CommonModule,
        LayoutRouterModule,
        AngularMaterialModule
    ],
    declarations: [
        MainWindowComponent,
        TopBarComponent,
        HomePage,
        MainRequestsComponent,
        RequestsListComponent
    ],
    providers: [
    ]
})
export class LayoutModule { }