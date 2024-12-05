import { Injectable } from "@angular/core";
import { Observable, catchError, combineLatest, config, map, of, switchMap, tap, throwError } from "rxjs";
import { AccountLedger, JournalEntry, AccountSubcategories, LedgerEntry, LedgerFilter } from "../../../shared/dataModels/financialModels/account-ledger.model";

import { ErrorHandlingService } from "../../../shared/error-handling/error-handling.service";
import { AuthStateService } from "../../../shared/user/auth/auth-state.service";
import { EventLogService } from "../../../shared/logging/event-log.service";
import { ApprovalStateService } from "../../../shared/account/approval-state.service";
import { AccountLedgerStateService } from "./account-ledger-state.service";
import { UserSecurityFacade } from "../../../shared/user/auth/user-security.facade";
import { PermissionType } from "../../../shared/dataModels/userModels/permissions.model";
import { AccountAccessEvent, AccountEventLog, EventLog, EventLogFilter, EventMetadata, EventType }  from "../../../shared/dataModels/loggingModels/event-logging.model";

import { JournalEntryStateService } from "../../journalEntry/journal-entry-state.service";
import { UserProfileStateService } from "../../../shared/user/profile/user-profile-state.service";
import { Timestamp } from "firebase/firestore";

@Injectable({
    providedIn: 'root'
})
export class AccountLedgerFacade {
    constructor(
        private accountLedgerState: AccountLedgerStateService,
        private journalEntryState: JournalEntryStateService,
        private userProfileState: UserProfileStateService,
        private eventLogService: EventLogService,
        private errorHandling: ErrorHandlingService,
        private securityFacade: UserSecurityFacade, // For permission checking
        private authState: AuthStateService // For permission checking
    ) { }

// # AccountLedgerFacade Public Methods

// ## Core Account Operations
// interface AccountLedgerFacade {
//   // AL-001: View Account Ledger Details
getAccountLedger(accountId: string): Observable<AccountLedger> {
    return this.userProfileState.userProfile$.pipe(
      switchMap(user => {
        if (!user || !this.canAccessAccount(user, accountId)) {
          return throwError(() => new Error('Unauthorized access'));
        }
        // Get both the account details and its journal entries
        return this.accountLedgerState.getAccountLedger(accountId).pipe(
          
          tap(() => {
            console.log(user);
            this.eventLogService.logAccountAccess({
            accountId,
            userId: user.id,
            dateAccessed: new Date(),
            authorized: true
          } as AccountAccessEvent)}),
          catchError(error => {
            console.log(error);
            return this.errorHandling.handleError(
              'getAccountLedger',
              {} as AccountLedger,
            )}
          ),
        );
      })
    );
  }

  getAccountEntries(accountId: string, filter?: LedgerFilter): Observable<LedgerEntry[]> {
    console.log('getAccountEntries');
    return this.journalEntryState.getJournalEntriesForAccount(accountId).pipe(
        switchMap((journalEntries: JournalEntry[]) => {
          console.log('journalEntries', journalEntries);
            const entries = journalEntries.map((journalEntry: JournalEntry) => {
                const transaction = journalEntry.transactions.find(t => t.accountId === accountId);
                if (!transaction) {
                    console.warn(`No transaction found for account ${accountId} in journal entry ${journalEntry.id}`);
                    return null;
                }
                return {
                    journalEntryId: journalEntry.id,
                    date: journalEntry.date,
                    description: journalEntry.description,
                    postReference: journalEntry.postReference,
                    debitAmount: transaction.debitAmount,
                    creditAmount: transaction.creditAmount,
                    runningBalance: 0,
                    status: journalEntry.status,
                    createdBy: journalEntry.createdBy,
                    createdAt: journalEntry.createdAt,
                    postedAt: journalEntry.postedAt,
                    postedBy: journalEntry.postedBy,
                    hasDocuments: journalEntry.documents.length > 0,
                } as LedgerEntry;
            }).filter((entry): entry is LedgerEntry => entry !== null);
            return of(entries);  // Wrap the array in an Observable
        }),
    );
}


    // Helper methods
    private canAccessAccount(user: any, accountId: string): Promise<boolean> {
      // Implement access control logic
      return this.securityFacade.validateAccess(user, accountId);
    }


    private checkReconciliationNeeded(ledger: AccountLedger): boolean {
      const lastReconciled = new Date(ledger.lastReconciled ? ledger.lastReconciled : ledger.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return lastReconciled < thirtyDaysAgo;
    }


//   // AL-002: View Ledger Entry via Post Reference
//   getEntryByPostRef(postRef: string): Observable<JournalEntry>;
    getEntryByPostRef(postRef: string): Observable<JournalEntry | undefined> {
        return this.journalEntryState.getEntryByPostRef(postRef);
    }

//   getSupportingDocuments(entryId: string): Observable<Document[]>;
    getSupportingDocuments(entryId: string): Observable<Document[]> {
        return this.accountLedgerState.getSupportingDocuments(entryId);
    }

//   // AL-003: Filter Ledger Transactions
    filterTransactions(accountId: string, criteria: LedgerFilter): Observable<LedgerEntry[]> {
      return this.getAccountEntries(accountId, criteria);
    }

//   // AL-004: Manage Account Access
//   grantAccess(accountId: string, userId: string, permissions: AccountPermissions): Observable<void>;
    grantAccess(accountId: string, userId: string): Promise<void> {
        const permitted = this.securityFacade.validatePermissions(PermissionType.GRANT_ACCOUNT_ACCESS, accountId);
        if (!permitted) { throw new Error } else{
          return this.securityFacade.grantAccess(accountId, userId, );
        }
    }

    revokeAccess(accountId: string, userId: string): Promise<void>{
        const permitted = this.securityFacade.validatePermissions(PermissionType.REVOKE_ACCOUNT_ACCESS, accountId);
        if (!permitted) { throw new Error } else {
          return this.securityFacade.revokeAccess(accountId, userId);
        }
    }
    getAccountAccessList(accountId: string): Promise<string[]>{
        return this.securityFacade.getAccountAccessList(accountId);
    }

//   // AL-005: View Account Event Log
  getEventLog(accountId: string, filter?: EventLogFilter): Observable<AccountEventLog>{
    const eventLog = this.eventLogService.getAccountEventLog(accountId, filter);
    eventLog.pipe(

      catchError(error => this.errorHandling.handleError(
        'getEventLog',
        {} as AccountEventLog,
      )),
      tap(() => this.eventLogService.logAccountEventLogAccess({
        accountId,
        userId: this.authState.userId$ ? this.authState.userId$ : 'ERROR',
        dateAccessed: new Date(),
        authorized: true,
        type: EventType.ACCOUNT_ACCESS_EVENT_LOG,
        payload: null
      } as AccountAccessEvent)),
    );
    return eventLog;

  }
  getEventDetails(eventId: string): Observable<EventMetadata>{
    const eventDetails = this.eventLogService.getEventDetails(eventId);
    eventDetails.pipe(
      catchError(error => this.errorHandling.handleError(
        'getEventDetails',
        {} as EventMetadata,
      )),
      tap((eventMetadata) => this.eventLogService.logEventDetailsAccess({
        accountId: eventMetadata.id,
        userId: this.authState.userId$ ? this.authState.userId$ : 'ERROR',
        dateAccessed: new Date(),
        authorized: true,
        type: EventType.EVENT_DETAILS_ACCESS,
        payload: null
      } as AccountAccessEvent)),
    )
    return eventDetails;
  }

//   // AL-006: Navigate to Account Reporting
//   getRelatedReports(accountId: string): Observable<ReportLink[]>;
//   generateReport(reportType: ReportType, accountId: string): Observable<Report>;

//   // AL-007: Calculate Period Balances
//   calculatePeriodBalance(accountId: string, period: AccountingPeriod): Observable<PeriodBalance>;
//   verifyBalances(accountId: string, period: AccountingPeriod): Observable<BalanceVerification>;
//   recalculateBalances(accountId: string): Observable<void>;

//   // AL-008: View Related Journal Entries
  getRelatedEntries(accountId: string): Observable<JournalEntry[]>{
    const journalEntries = this.journalEntryState.getJournalEntriesForAccount(accountId);
    journalEntries.pipe(
      catchError(error => this.errorHandling.handleError(
        'getRelatedEntries',
        {} as JournalEntry[],
      )),
      tap(() => this.eventLogService.logAccountAccess({
        accountId,
        userId: this.authState.userId$ ? this.authState.userId$ : 'ERROR',
        dateAccessed: new Date(),
        authorized: true
      } as AccountAccessEvent)),
    )
    return journalEntries;
  }
//   getEntryRelationships(entryId: string): Observable<EntryRelationship[]>;
//   getTransactionChain(entryId: string): Observable<TransactionChain>;

//   // AL-009: View Supporting Documents
//   getDocuments(entryId: string): Observable<Document[]>;
//   getDocumentContent(documentId: string): Observable<DocumentContent>;
//   getDocumentMetadata(documentId: string): Observable<DocumentMetadata>;

//   // AL-010: Edit Account Details
//   updateAccountDetails(accountId: string, changes: AccountChanges): Observable<void>;
//   validateChanges(accountId: string, changes: AccountChanges): Observable<ValidationResult>;
//   getChangeHistory(accountId: string): Observable<ChangeHistory[]>;

//   // AL-011: View Unapproved Entries
//   getPendingEntries(accountId: string): Observable<PendingEntry[]>;
//   getEntryStatus(entryId: string): Observable<EntryStatus>;
//   calculatePendingImpact(accountId: string): Observable<PendingImpact>;

//   // Common State Management
//   selectAccount(accountId: string): void;
    // this.accountLedgerState.selectAccount(accountId);
//   clearSelectedAccount(): void;
    // this.accountLedgerState.clearSelectedAccount();
//   getSelectedAccount(): Observable<AccountLedger | null>;
    // return this.accountLedgerState.getSelectedAccount();

// }

// // Supporting Interfaces
// interface LedgerFilter {
//   dateRange?: DateRange;
//   entryTypes?: EntryType[];
//   amountRange?: AmountRange;
//   statusFilter?: EntryStatus[];
//   documentTypes?: DocumentType[];
// }

// interface FilterCriteria {
//   searchTerm?: string;
//   filters: LedgerFilter;
//   sorting?: SortConfig;
//   pagination?: PaginationConfig;
// }

// interface AccountPermissions {
//   canView: boolean;
//   canEdit: boolean;
//   canApprove: boolean;
//   canExport: boolean;
//   documentAccess: DocumentAccessLevel;
// }

// interface PendingImpact {
//   potentialBalance: number;
//   pendingDebits: number;
//   pendingCredits: number;
//   entryCount: number;
//   riskLevel: RiskLevel;
// }

// interface ValidationResult {
//   isValid: boolean;
//   errors: ValidationError[];
//   warnings: ValidationWarning[];
//   recommendations?: string[];
// }

// # State Service Requirements
// Based on the method signatures above, we need these key state management services:

// 1. **AccountLedgerStateService**
//    - Manages current account selection
//    - Maintains ledger view state
//    - Handles filter state
//    - Manages pagination state

// 2. **DocumentStateService**
//    - Manages document view state
//    - Handles document access tokens
//    - Maintains document cache

// 3. **ApprovalStateService**
//    - Manages pending entry state
//    - Maintains approval workflow state
//    - Handles status updates

// 4. **EventLogStateService**
//    - Manages event log view state
//    - Maintains event filters
//    - Handles event tracking


}
