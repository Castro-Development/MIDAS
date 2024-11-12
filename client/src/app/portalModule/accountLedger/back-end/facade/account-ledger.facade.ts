import { Injectable } from "@angular/core";
import { Observable, catchError, combineLatest, config, map, of, switchMap, tap, throwError } from "rxjs";
import { AccountLedger, JournalEntry, AccountSubcategories, LedgerEntry, LedgerFilter } from "../../../../shared/dataModels/financialModels/account-ledger.model";
import { ErrorHandlingService } from "../../../../shared/services/error-handling.service";
import { AuthStateService } from "../../../../shared/states/auth-state.service";
import { EventLogService } from "../../../../shared/services/event-log.service";
import { ApprovalStateService } from "../../../../shared/states/approval-state.service";
import { AccountLedgerStateService } from "../state-service/account-ledger-state.service";
import { JournalEntryStateService } from "../../../../shared/states/journal-entry-state.service";
import { UserSecurityFacade } from "../../../../shared/facades/userFacades/user-security.facade";
import { PermissionType } from "../../../../shared/dataModels/userModels/permissions.model";
import { AccountAccessEvent } from "../../../../shared/dataModels/loggingModels/event-logging.model";

@Injectable({
    providedIn: 'root'
})
export class AccountLedgerFacade {
    constructor(
        private accountLedgerState: AccountLedgerStateService,
        private journalEntryState: JournalEntryStateService,
        private approvalState: ApprovalStateService, 
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
    return this.authState.userProfile$.pipe(
      switchMap(user => {
        if (!user || !this.canAccessAccount(user, accountId)) {
          return throwError(() => new Error('Unauthorized access'));
        }
        // Get both the account details and its journal entries
        return combineLatest([
          // Get account details
          this.accountLedgerState.getAccountLedger(accountId),
          // Get journal entries that affect this account
          this.journalEntryState.getJournalEntriesForAccount(accountId)
        ]).pipe(
          map(([ledger, journalEntries]) => {
            // Convert journal entries to ledger entries for this account
            const ledgerEntries = journalEntries
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map(journalEntry => {
                // Find the transaction for this account
                const transaction = journalEntry.transactions.find(
                  t => t.accountId === accountId
                );
                
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
                  runningBalance: 0, // Will be calculated next
                  status: journalEntry.status,
                  createdBy: journalEntry.createdBy,
                  createdAt: journalEntry.createdAt,
                  postedAt: journalEntry.postedAt,
                  postedBy: journalEntry.postedBy,
                } as LedgerEntry;
              })
              .filter((entry): entry is LedgerEntry => entry !== null);

            // Calculate running balances
            let runningBalance = 0;
            ledgerEntries.forEach(entry => {
              runningBalance += (entry.debitAmount - entry.creditAmount);
              entry.runningBalance = runningBalance;
            });

            // Return enhanced ledger with entries
            return {
              ...ledger,
              lastReconciled: ledger.lastReconciled,
              needsReconciliation: this.checkReconciliationNeeded(ledger),
              entries: ledgerEntries,
              currentBalance: runningBalance // Update current balance from calculations
            } as AccountLedger;
          }),
          tap(() => this.eventLogService.logAccountAccess({
            accountId,
            userId: user.id,
            dateAccessed: new Date(),
            authorized: true
          } as AccountAccessEvent)),
          catchError(error => this.errorHandling.handleError(
            'getAccountLedger',
            {} as AccountLedger,
          )),
        );
      })
    );
  }
  
  getAccountEntries(accountId: string, filter?: LedgerFilter): Observable<LedgerEntry[]> {
    return this.journalEntryState.getJournalEntriesForAccount(accountId).pipe(
        switchMap((journalEntries: JournalEntry[]) => {
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
                    postedBy: journalEntry.postedBy
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
//   getEventLog(accountId: string, filter?: EventLogFilter): Observable<EventLog[]>;
//   getEventDetails(eventId: string): Observable<EventDetail>;

//   // AL-006: Navigate to Account Reporting
//   getRelatedReports(accountId: string): Observable<ReportLink[]>;
//   generateReport(reportType: ReportType, accountId: string): Observable<Report>;

//   // AL-007: Calculate Period Balances
//   calculatePeriodBalance(accountId: string, period: AccountingPeriod): Observable<PeriodBalance>;
//   verifyBalances(accountId: string, period: AccountingPeriod): Observable<BalanceVerification>;
//   recalculateBalances(accountId: string): Observable<void>;

//   // AL-008: View Related Journal Entries
//   getRelatedEntries(accountId: string): Observable<RelatedEntry[]>;
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