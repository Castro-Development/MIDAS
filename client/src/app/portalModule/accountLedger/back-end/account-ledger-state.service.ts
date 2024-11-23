import { Injectable, OnDestroy } from "@angular/core";
import { Firestore, getDocs, collection, onSnapshot, QueryConstraint, where } from "firebase/firestore";
import { BehaviorSubject, Subject, Observable, map, filter, catchError, from, combineLatest, switchMap, tap, finalize } from "rxjs";
import { ErrorHandlingService } from "../../../shared/error-handling/error-handling.service";
import { query } from "@angular/fire/firestore";
import { AccountLedger, AccountLedgerReference, JournalEntry, LedgerEntry, LedgerFilter, NormalSide } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { EventLogService } from "../../../shared/logging/event-log.service";
import { EventType } from "../../../shared/dataModels/loggingModels/event-logging.model";
import { AccountFirestoreService } from "../../chartOfAccount/back-end/account-firestore.service";


@Injectable({ providedIn: 'root' })
export class AccountLedgerStateService implements OnDestroy {


  // Internal state management
  private readonly ledgerSubject = new Subject<AccountLedger>();
  private readonly selectedAccountSubject = new BehaviorSubject<string | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly destroy$ = new Subject<void>();

  // Public observables
  readonly ledgers$ = this.ledgerSubject.asObservable();
  readonly selectedAccount$ = this.selectedAccountSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(
    private errorHandling: ErrorHandlingService,
    private eventLogging: EventLogService,
    private accountLedgerFirestoreService: AccountFirestoreService,
  ) {
  }

  getAccountLedger(accountId: string): Observable<AccountLedger> {
    this.loadingSubject.next(true);
    this.selectAccount(accountId);
    return this.accountLedgerFirestoreService.getAccount(accountId).pipe(
      filter((account): account is AccountLedger => account !== null), // Type guard
    );
  }

  filterTransactions(accountId: string, criteria: LedgerFilter): Observable<LedgerEntry[]> {
    throw new Error("Method not implemented.");
    // Check if this account ledger's entries are already loaded, if not, load them.
    // If they are loaded, apply the filter criteria and return the filtered entries.
  }

  // Selection management
  selectAccount(accountId: string){
    this.selectedAccountSubject.next(accountId);
  }

  clearSelectedAccount(): void {
    this.selectedAccountSubject.next(null);
  }


  getSupportingDocuments(entryId: string): Observable<Document[]> {
    throw new Error("Method not implemented.");
    // Get the supporting documents for the given entryId
  }



  private calculateRunningBalance(entries: LedgerEntry[], normalSide: NormalSide): number {

    let runningBalance = 0;
    if(normalSide === NormalSide.CREDIT) {
      for (const entry of entries) {
        runningBalance += entry.creditAmount - entry.debitAmount;
      }
    } else {
      for (const entry of entries) {
        runningBalance += entry.debitAmount - entry.creditAmount;
      }
    }

    return runningBalance;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.ledgerSubject.complete();
    this.selectedAccountSubject.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
  }
}

// Supporting interfaces


