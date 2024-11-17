import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { HelpGlobalModule } from '../shared/helpFeature/help-global.module';
import { UserModuleRoutingModule } from './user-module-routing.module';
import { RequestSystemAccessComponent } from './requestSystemAccess/request-system-access.component';
import { CalendarComponent } from './calendar/calendar.component';
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
import { AppPhoneInputComponent } from './requestSystemAccess/utils/app-phone-input.component'
import { SplashScreenComponent } from './splash-screen-component/splash-screen-component.component';



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
    
  ]
})
export class UserModule { }
