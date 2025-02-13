import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntryPointModule } from './entry-point/entry-point.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from './services/auth.service';
import { FileService } from './services/file.service';
import { MessagesService } from './services/messages.service';
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
import { MethodService } from './services/method.service';
import { PlotService } from './services/plot.service';
import { InjectionConditionQCService } from './services/injectionConditionsQC.service';
import { QuantificationService } from './services/quantification.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { UnauthorizedInterceptor } from './interceptors/unauthorized.interceptor';

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
    MessagesService,
    WetLabService,
    ThresholdService,
    DataService,
    ThemeService,
    QGeneratorService,
    InstrumentService,
    ApplicationService,
    MethodService,
    InjectionConditionQCService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    TestService,
    RoleGuardService,
    ThemeSelectorComponent,
    ThemeService,
    PlotService,
    QuantificationService,
    { provide: MAT_DATE_LOCALE, useValue: 'es' },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
