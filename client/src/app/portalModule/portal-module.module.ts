import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { AccountEventCard } from './accountEventLog/account-event.card';
import { AccountLedgerComponent } from './accountLedger/account-ledger.component';
import { AccountLedgerCard } from './accountLedger/account-ledger.card';
import { ChartOfAccountsComponent } from './chartOfAccount/chart-of-accounts.component';
import { JournalEntryFormCard } from './journalEntry/journalEntryForm/journal-entry-card.component';
import { JournalEntryFormComponent } from './journalEntry/journalEntryForm/journal-entry-form.component';
import { JournalEntryReviewComponent } from './journalEntry/journalEntryReview/journal-entry-review.component';
import { JournalReviewCard } from './journalEntry/journalEntryReview/journal-entry-review.card';

@NgModule({
  declarations: [
    JournalEntryFormCard,
    JournalEntryFormComponent,
    PortalDashboardComponent,
    ChartOfAccountsCard,
    FilterDialogComponent,
    AccountEventLogComponent,
    AccountEventCard,
    AccountLedgerComponent,
    AccountLedgerCard,
    ChartOfAccountsComponent,
    ChartOfAccountsCard,
    JournalEntryReviewComponent,
    JournalReviewCard

  ],
  imports: [
    CommonModule,
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
    MatCardModule
  ]
})
export class PortalModule { }
