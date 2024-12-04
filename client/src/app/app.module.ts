import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


//import { AdminRoutingModule } from './adminModule/admin-routing.module';
import { MatIcon } from '@angular/material/icon';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient, provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NavbarComponent } from './userModule/navbar/navbar.component';
import { ErrorHandlingService } from './shared/error-handling/error-handling.service';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AdminSVG } from './userModule/navbar/utils/admin.svg';
import { CalendarSVG } from './userModule/navbar/utils/calendar.svg';
import { PortalSVG } from './userModule/navbar/utils/portal.svg';
import { ChartAccountSVG } from './portalModule/portalDashboard/utils/chart-of-accounts.svg';
import { JournalEntrySVG } from './portalModule/portalDashboard/utils/journal-entry.svg';
import { JournalReviewSVG } from './portalModule/portalDashboard/utils/journal-review.svg';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './userModule/calendar/calendar.component';
import { AdminAppFormComponent } from './adminModule/admin-app-form/admin-app-form.component';
import { AdminEditUserComponent } from './adminModule/admin-edit-user/admin-edit-user.component';
import { AdminUserApplicationsComponent } from './adminModule/admin-user-applications/admin-user-applications.component';
import { AdminDashboardComponent } from './adminModule/adminDashboard/admin-dashboard.component';
import { AdminExpiredPasswordReportComponent } from './adminModule/adminExpiredPasswordReport/admin-expired-password-report.component';
import { AdminUsersChartComponent } from './adminModule/adminUsersChart/admin-users-chart.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AccountEventLogComponent } from './portalModule/accountEventLog/account-event-log.component';
import { AccountLedgerCard } from './portalModule/accountLedger/account-ledger.card';
import { AccountLedgerComponent } from './portalModule/accountLedger/account-ledger.component';
import { AccountCreationCard } from './portalModule/adminGeneralLedgerFunctions/adminAccountCreate/admin-account-creation.card';
import { AccountCreationComponent } from './portalModule/adminGeneralLedgerFunctions/adminAccountCreate/admin-account-creation.component';
import { FilterDialogComponent } from './portalModule/chartOfAccount/account-filter.component';
import { ChartOfAccountsCard } from './portalModule/chartOfAccount/chart-of-accounts.card';
import { ChartOfAccountsComponent } from './portalModule/chartOfAccount/chart-of-accounts.component';
import { FiscalPeriodManagementComponent } from './portalModule/fiscalPeriod/fiscal-period-management.component';
import { JournalEntryFormCard } from './portalModule/journalEntry/entryForm/journal-entry-card.component';
import { JournalEntryFormComponent } from './portalModule/journalEntry/entryForm/journal-entry-form.component';
import { JournalReviewCard } from './portalModule/journalEntry/entryReview/journal-entry-review.card';
import { JournalEntryReviewComponent } from './portalModule/journalEntry/entryReview/journal-entry-review.component';
import { JournalSubmissionCard } from './portalModule/journalEntry/entrySubmissionReview/journal-submission.card';
import { JournalSubmissionComponent } from './portalModule/journalEntry/entrySubmissionReview/journal-submission.component';
import { PortalDashboardComponent } from './portalModule/portalDashboard/portal-dashboard.component';
import { RouterLink } from '@angular/router';
import { ForgotPasswordComponent } from './userModule/forgotPassword/forgot-password.component';
import { InboxComponent } from './userModule/inbox/inbox.component';
import { LoginComponent } from './userModule/login/login.component';
import { ProfileComponent } from './userModule/profile/profile.component';
import { RequestSystemAccessComponent } from './userModule/requestSystemAccess/request-system-access.component';
import { AppPhoneInputComponent } from './userModule/requestSystemAccess/utils/app-phone-input.component';
import { SplashScreenComponent } from './userModule/splash-screen-component/splash-screen-component.component';
import { MessagingComponent } from './userModule/messaging/messaging.component';
import { NotificationBubble } from './userModule/splash-screen-component/utils/notification-bubble.svg';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    //Admin Module
    AdminExpiredPasswordReportComponent,
    AdminDashboardComponent,
    AdminUsersChartComponent,
    AdminUserApplicationsComponent,
    AdminAppFormComponent,
    AdminEditUserComponent,
    //General Ledger Functions
    AccountCreationComponent,
    AccountCreationCard,
    //Portal Module
    JournalEntryFormComponent,
    JournalEntryFormCard,
    PortalDashboardComponent,
    ChartOfAccountsCard,
    FilterDialogComponent,
    AccountEventLogComponent,
    AccountLedgerComponent,
    AccountLedgerCard,
    ChartOfAccountsComponent,
    ChartOfAccountsCard,
    JournalEntryReviewComponent,
    JournalReviewCard,
    JournalSubmissionComponent,
    JournalSubmissionCard,
    FiscalPeriodManagementComponent,

    // User Module
    CalendarComponent,
    ForgotPasswordComponent,
    InboxComponent,
    LoginComponent,
    ProfileComponent,
    RequestSystemAccessComponent,
    SplashScreenComponent,
    AppPhoneInputComponent,
    MessagingComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatFormField,
    //AdminModule,
    AdminSVG,
    CalendarSVG,
    PortalSVG,
    ChartAccountSVG,
    JournalEntrySVG,
    JournalReviewSVG,
    FullCalendarModule,
    MatIcon,

    //General Ledger

    //Portal Module
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,

    //User Module
    CommonModule,
    RouterLink,

    NotificationBubble,

],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({"projectId":"midas-app-239bc","appId":"1:880947371935:web:1e02db79c3e04b0be567aa","storageBucket":"midas-app-239bc.appspot.com","apiKey":"AIzaSyBefPwnb0z3xR2KZrgQ11pLVaK4guxiwp8","authDomain":"midas-app-239bc.firebaseapp.com","messagingSenderId":"880947371935"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    ErrorHandlingService,
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
