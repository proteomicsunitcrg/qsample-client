import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntryPointModule } from './entry-point/entry-point.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from './services/auth.service';
import { FileService } from './services/file.service';
import { WetLabService } from './services/wetlab.service';
import { TestService } from './services/test.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RoleGuardService } from './services/role-guard.service';
import { authInterceptorProviders, AuthInterceptor } from './interceptors/auth.interceptor';
import { from, fromEventPattern } from 'rxjs';
import { ThemeSelectorComponent } from './page/top-bar/theme-selector/theme-selector.component';
import { ThemeService } from './services/theme.service';
import { WetlabPlotComponent } from './wetlab/wetlab-plot/wetlab-plot.component';
import { ThresholdService } from './services/threshold.service';
import { DataService } from './services/data.service';
import { QGeneratorService } from './services/qGenerator.service';
import { InstrumentService } from './services/instrument.service';
import { ApplicationService } from './services/application.service';

@NgModule({
  declarations: [
    AppComponent,
    // WetlabPlotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EntryPointModule,
    // FlexLayoutModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    FileService,
    WetLabService,
    ThresholdService,
    DataService,
    ThemeService,
    QGeneratorService,
    InstrumentService,
    ApplicationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    TestService,
    RoleGuardService,
    ThemeSelectorComponent,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
