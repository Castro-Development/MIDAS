import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGeneralLedgerFunctionsModule } from './adminGeneralLedgerFunctions/admin-general-ledger-functions.module';
import { PortalDashboardComponent } from './portalDashboard/portal-dashboard.component';
import { PortalRoutingModule } from './portal-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOfAccountsCard } from './chartOfAccount/chart-of-accounts.card';
import { FilterDialogComponent } from './chartOfAccount/account-filter.component';
import { AccountEventLogComponent } from './accountEventLog/account-event-log.component';
import { AccountLedgerComponent } from './accountLedger/account-ledger.component';
import { AccountLedgerCard } from './accountLedger/account-ledger.card';
import { ChartOfAccountsComponent } from './chartOfAccount/chart-of-accounts.component';
import { JournalEntryFormCard } from './journalEntry/entryForm/journal-entry-card.component';
import { JournalEntryFormComponent } from './journalEntry/entryForm/journal-entry-form.component';
import { JournalEntryReviewComponent } from './journalEntry/entryReview/journal-entry-review.component';
import { JournalReviewCard } from './journalEntry/entryReview/journal-entry-review.card';
import { JournalSubmissionComponent } from './journalEntry/entrySubmissionReview/journal-submission.component';
import { JournalSubmissionCard } from './journalEntry/entrySubmissionReview/journal-submission.card';
import { FiscalPeriodManagementComponent } from './fiscalPeriod/fiscal-period-management.component';
import { ChartAccountSVG } from './portalDashboard/utils/chart-of-accounts.svg';
import { JournalEntrySVG } from './portalDashboard/utils/journal-entry.svg';
import { JournalReviewSVG } from './portalDashboard/utils/journal-review.svg';

@NgModule({
  declarations: [
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
    FiscalPeriodManagementComponent

  ],
  imports: [
    CommonModule,
    AdminGeneralLedgerFunctionsModule,
    PortalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    ChartAccountSVG,
    JournalEntrySVG,
    JournalReviewSVG,

  ]
})
export class PortalModule { }
