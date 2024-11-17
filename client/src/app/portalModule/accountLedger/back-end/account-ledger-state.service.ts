import { Injectable, OnDestroy } from "@angular/core";
import { Firestore, getDocs, collection, onSnapshot, QueryConstraint, where } from "firebase/firestore";
import { BehaviorSubject, Subject, Observable, map, filter, catchError, from, combineLatest, switchMap, tap, finalize } from "rxjs";
import { query } from "@angular/fire/firestore";
import { AccountLedgerFirestoreService } from "./account-ledger-firestore.service";
import { AccountLedger, AccountLedgerReference, JournalEntry, LedgerEntry, LedgerFilter, NormalSide } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { EventType } from "../../../shared/dataModels/loggingModels/event-logging.model";
import { ErrorHandlingService } from "../../../shared/errorHandling/error-handling.service";
import { EventLogService } from "../../../shared/eventLog/event-log.service";


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
    private firestore: Firestore,
    private errorHandling: ErrorHandlingService,
    private eventLogging: EventLogService,
    private accountLedgerFirestoreService: AccountLedgerFirestoreService,
  ) {
  }

  getAccountLedger(accountId: string): Observable<AccountLedger> {//Gathers all the information but the specific entries, those are 
    this.loadingSubject.next(true);                               //gathered in account-ledger.facade.ts. 
    this.selectAccount(accountId);
    // Get the stored account ledger information including journal entries post references
    return this.accountLedgerFirestoreService.getAccountLedger(accountId).pipe(
      tap((ledger: AccountLedger) => {
        this.ledgerSubject.next(ledger);
        this.loadingSubject.next(false);
        this.eventLogging.logEvent(EventType.ACCOUNT_ACCESS, null);
      }),
      catchError(error => this.errorHandling.handleError(
        'getAccountLedger',
        {} as AccountLedger
      ))
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


