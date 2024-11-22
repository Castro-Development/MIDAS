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
import { map } from 'rxjs/operators';


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
import { UserModule } from './userModule/user-module.module';
import { AdminModule } from './adminModule/admin-module.module';
import { NavbarComponent } from './userModule/navbar/navbar.component';
import { ErrorHandlingService } from './shared/services/error-handling.service';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AdminSVG } from './userModule/navbar/utils/admin.svg';
import { CalendarSVG } from './userModule/navbar/utils/calendar.svg';
import { PortalSVG } from './userModule/navbar/utils/portal.svg';
import { ChartAccountSVG } from './portalModule/portalDashboard/utils/chart-of-accounts.svg';
import { JournalEntrySVG } from './portalModule/portalDashboard/utils/journal-entry.svg';
import { JournalReviewSVG } from './portalModule/portalDashboard/utils/journal-review.svg';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './userModule/calendar/calendar.component';


// Portal Module imports
//import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
//import { MatButtonModule } from '@angular/material/button';
//import { MatInputModule } from '@angular/material/input';
//import { MatIconModule } from '@angular/material/icon';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';



// import { AdminGeneralLedgerFunctionsModule } from './portalModule/adminGeneralLedgerFunctions/admin-general-ledger-functions.module';
// import { PortalDashboardComponent } from './portalModule/portalDashboard/portal-dashboard.component';
// import { PortalRoutingModule } from './portalModule/portal-routing.module';
// import { MatDialogModule } from '@angular/material/dialog';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';

// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { MatCardModule } from '@angular/material/card';

// import { ChartOfAccountsCard } from './portalModule/chartOfAccount/chart-of-accounts.card';
// import { FilterDialogComponent } from './portalModule/chartOfAccount/account-filter.component';
// import { AccountEventLogComponent } from './portalModule/accountEventLog/account-event-log.component';
// import { AccountLedgerComponent } from './portalModule/accountLedger/account-ledger.component';
// import { AccountLedgerCard } from './portalModule/accountLedger/account-ledger.card';
// import { ChartOfAccountsComponent } from './portalModule/chartOfAccount/chart-of-accounts.component';
// import { JournalEntryFormCard } from './portalModule/journalEntry/entryForm/journal-entry-card.component';
// import { JournalEntryFormComponent } from './portalModule/journalEntry/entryForm/journal-entry-form.component';
// import { JournalEntryReviewComponent } from './portalModule/journalEntry/entryReview/journal-entry-review.component';
// import { JournalReviewCard } from './portalModule/journalEntry/entryReview/journal-entry-review.card';
// import { JournalSubmissionComponent } from './portalModule/journalEntry/entrySubmissionReview/journal-submission.component';
// import { JournalSubmissionCard } from './portalModule/journalEntry/entrySubmissionReview/journal-submission.card';
// import { FiscalPeriodManagementComponent } from './portalModule/fiscalPeriod/fiscal-period-management.component';









@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ChartAccountSVG,
    JournalEntrySVG,
    JournalReviewSVG,


    //portal module
    // JournalEntryFormComponent,
    // JournalEntryFormCard,
    // PortalDashboardComponent,
    // ChartOfAccountsCard,
    // FilterDialogComponent,
    // AccountEventLogComponent,
    // AccountLedgerComponent,
    // AccountLedgerCard,
    // ChartOfAccountsComponent,
    // ChartOfAccountsCard,
    // JournalEntryReviewComponent,
    // JournalReviewCard,
    // JournalSubmissionComponent,
    // JournalSubmissionCard,
    // FiscalPeriodManagementComponent,

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
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatFormField,
    UserModule,
    AdminModule,
    AdminSVG,
    CalendarSVG,
    PortalSVG,
    // ChartAccountSVG,
    // JournalEntrySVG,
    // JournalReviewSVG,
    FullCalendarModule,


    // portal Module
    // CommonModule,
    // AdminGeneralLedgerFunctionsModule,
    // PortalRoutingModule,
    // FormsModule,
    // ReactiveFormsModule,
    // MatDialogModule,
    // MatButtonModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatSelectModule,
    // MatIconModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
    // MatCardModule,
    // ChartAccountSVG,
    // JournalEntrySVG,
    // JournalReviewSVG,





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
