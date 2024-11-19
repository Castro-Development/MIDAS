import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpGlobalModule } from '../shared/helpFeature/help-global.module';
import { UserModuleRoutingModule } from './user-module-routing.module';
import { RequestSystemAccessComponent } from './requestSystemAccess/request-system-access.component';
import { ForgotPasswordComponent } from './forgotPassword/forgot-password.component';
import { InboxComponent } from './inbox/inbox.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterLink } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SplashScreenComponent } from './splash-screen-component/splash-screen-component.component';
import { AppPhoneInputComponent } from './requestSystemAccess/utils/app-phone-input.component'
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';








@NgModule({
  declarations: [
    CalendarComponent,
    ForgotPasswordComponent,
    InboxComponent,
    LoginComponent,
    ProfileComponent,
    RequestSystemAccessComponent,
    SplashScreenComponent,
    AppPhoneInputComponent,


  ],
  imports: [
    CommonModule,
    HelpGlobalModule,
    UserModuleRoutingModule,
    RouterLink,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,

  ]
})
export class UserModule { }
