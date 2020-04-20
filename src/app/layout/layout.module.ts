import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWindowComponent } from './main-window/main-window.component';
import { TopBarComponent } from './top-bar/top-bar.component'
import { LayoutRouterModule } from './layout-router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AngularMaterialModule } from '../angular-material.module';


@NgModule({
    imports: [
        CommonModule,
        LayoutRouterModule,
        AngularMaterialModule
    ],
    declarations: [
        MainWindowComponent,
        TopBarComponent,
        WelcomeComponent
    ],
    providers: [
    ]
})
export class LayoutModule { }