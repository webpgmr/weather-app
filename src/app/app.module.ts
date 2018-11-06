import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import app service
import { AppService } from './app.service';
import { GeolocationService } from './app.geoLocationService';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';

// ngx bootstrap modules
import { AlertModule, ButtonsModule  } from 'ngx-bootstrap';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    AnalyticsComponent,
    ProfileComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    ChartsModule
  ],
  providers: [
    AppService,
    GeolocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
