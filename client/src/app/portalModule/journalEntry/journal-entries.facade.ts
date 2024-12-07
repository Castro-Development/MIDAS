import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, firstValueFrom, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorHandlingService } from '../../shared/error-handling/error-handling.service'
import { JournalEntry, JournalEntryStatus, JournalTransaction, LedgerEntry, NormalSide } from '../../shared/dataModels/financialModels/account-ledger.model';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { QueryConstraint, orderBy, query, where } from 'firebase/firestore';
import { EventLogService } from '../../shared/logging/event-log.service';
import { EventType } from '../../shared/dataModels/loggingModels/event-logging.model';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { AccountFirestoreService } from '../chartOfAccount/back-end/account-firestore.service'
import { JournalEntryStateService } from './journal-entry-state.service';
import { Router } from '@angular/router';
import { JournalEntryFirestoreService } from './journal-firestore.service';
import { UserProfileStateService } from '../../shared/user/profile/user-profile-state.service';





@Injectable({
  providedIn: 'root'
})
export class JournalEntryFacade {




  // Subjects
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  private firestore = inject(Firestore);

  // Derived observables

  constructor(
    private errorHandling: ErrorHandlingService,
    private eventLog: EventLogService,
    private userProfileState: UserProfileStateService,
    private accountService: AccountFirestoreService,
    private journalState: JournalEntryStateService,
    private journalService: JournalEntryFirestoreService,
    private router: Router
  ) { }

  saveEntryDraft(journalEntry: JournalEntry): Promise<string> {
    return this.journalState.saveEntryDraft(journalEntry);
  }

  /**
   * Create a new journal entry
   */
  createJournalEntry(entry: Omit<JournalEntry, 'id' | 'status' | 'createdAt' | 'createdBy'>): Observable<void> {

    const newEntry: JournalEntry = {
      ...entry,
      id: (Math.random() * 1000).toString(), // Hook this into firestore service
      status: JournalEntryStatus.DRAFT,
      createdAt: new Date(),
      createdBy: (Math.random() * 1000).toString()//getAuth().currentUser?.uid, // You'd get this from your auth service
    };

    return this.validateJournalEntry(newEntry).pipe(
      switchMap(() => this.saveJournalEntry(newEntry)),
      tap(() => {
        this.eventLog
      }),
      //   catchError(this.errorHandling.handleError('createJournalEntry')),

    );
  }

  selectEntry(postRef: string): void {
    this.journalState.getEntryByPostRef(postRef).pipe(
      tap(entry => {
        if (entry) {
          this.journalState.selectEntry(entry);
          this.router.navigate(['/journal-entry-review/' + entry.id]);
        }
      })
    )
  }

  /**
   * Submit journal entry for approval
   */
  submitForApproval(entryId: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.getJournalEntry(entryId).pipe(
      switchMap(entry => {
        if (!entry) {
          return throwError(() => new Error('Journal entry not found'));
        }

        const updatedEntry = {
          ...entry,
          status: JournalEntryStatus.PENDING
        };

        return this.saveJournalEntry(updatedEntry);
      }),
      tap(() => {
        this.eventLog.logEvent(EventType.JOURNAL_ENTRY_SUBMITTED, { entryId });
      }),
      //   catchError(this.errorHandling.handleError('submitForApproval')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Approve a journal entry
   */
  approveEntry(entry: JournalEntry) {
    this.loadingSubject.next(true);
    if(entry.status === JournalEntryStatus.APPROVED || entry.status === JournalEntryStatus.POSTED) { throw new Error("Entry is not pending approval") }

    firstValueFrom(this.userProfileState.userProfile$).then(user => {
      console.log('Current user ID:', user.id);
      const updatedEntry = {
        ...entry,
        status: JournalEntryStatus.APPROVED,
        approvedBy: user.id,
        approvedAt: new Date()
      }
      console.log('Updated entry:', updatedEntry);
      
      this.journalService.updateEntry(updatedEntry.id, updatedEntry).then(() => {
        this.eventLog.logEvent(EventType.JOURNAL_ENTRY_APPROVED, { entryId: entry.id });
        this.loadingSubject.next(false);
      }).then(() => {
        this.postToAccounts(updatedEntry);
      })
    })
    
  }

  /**
   * Reject a journal entry
   */
  rejectEntry(entryId: string, reason: string): Observable<void> {
    this.loadingSubject.next(true);

    return this.getJournalEntry(entryId).pipe(
      switchMap(entry => {
        if (!entry) {
          return throwError(() => new Error('Journal entry not found'));
        }

        const updatedEntry = {
          ...entry,
          status: JournalEntryStatus.REJECTED,
          notes: reason
        };

        return this.saveJournalEntry(updatedEntry);
      }),
      tap(() => {
        this.eventLog.logEvent(EventType.JOURNAL_ENTRY_REJECTED, { entryId, reason });
      }),
      //   catchError(this.errorHandling.handleError('rejectEntry')),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Load journal entries with optional filters
   */
  loadEntries(filters?: {
    status?: JournalEntryStatus;
    startDate?: Date;
    endDate?: Date;
  }): Observable<JournalEntry[]> {
    this.loadingSubject.next(true);

    return this.fetchJournalEntries(filters).pipe(
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getAccountLedgerEntries(accountNumber: string): Observable<LedgerEntry[]> {
    return this.journalState.getJournalEntriesForAccount(accountNumber).pipe(
      map(entries => entries.map(entry => {
        return {
          date: entry.date,
          description: entry.description,
          debitAmount: entry.transactions.find(t => t.accountId === accountNumber)?.debitAmount || 0,
          creditAmount: entry.transactions.find(t => t.accountId === accountNumber)?.creditAmount || 0,
          runningBalance: 0,
          journalEntryId: entry.id,
          hasDocuments: entry.documents?.length > 0
        };
      }))
    );
  }


  private validateJournalEntry(entry: JournalEntry): Observable<boolean> {
    const errors: string[] = [];

    // Check required fields
    if (!entry.id) errors.push('Entry number is required');
    if (!entry.date) errors.push('Date is required');
    if (!entry.description) errors.push('Description is required');
    if (!entry.transactions?.length) errors.push('At least one transaction is required');

    // Validate debits and credits balance
    const totalDebits = entry.transactions.reduce((sum, t) => sum + t.debitAmount, 0);
    const totalCredits = entry.transactions.reduce((sum, t) => sum + t.creditAmount, 0);

    if (totalDebits !== totalCredits) {
      errors.push('Total debits must equal total credits');
    }

    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    }

    return of(true);
  }

  transactionToLedgerEntry(transaction: JournalTransaction): LedgerEntry {
    return {
      date: new Date(),
      description: transaction.description || '',
      debitAmount: transaction.debitAmount,
      creditAmount: transaction.creditAmount,
      journalEntryId: transaction.journalEntryId
    } as LedgerEntry;
  }

  private postToAccounts(entry: JournalEntry) {
    console.log('Posting to accounts:', entry);
    entry.transactions.forEach(transaction => {
      console.log('Posting transaction:', transaction);
      const accountId = transaction.accountId;
      firstValueFrom(this.accountService.getAccount(accountId)).then((account) => {
        console.log(account);
          if (!account) {
            throw new Error('Account not found');
          }

          const updatedDebitAccount = {
            ...account,
            transaction: account.transaction ? [...account.transaction, this.transactionToLedgerEntry(transaction)] : [this.transactionToLedgerEntry(transaction)],
            totalDebits: account.totalDebits ? account.totalDebits + transaction.debitAmount : transaction.debitAmount,
            totalCredits: account.totalCredits ? account.totalCredits + transaction.creditAmount : transaction.creditAmount,
            currentBalance: account.currentBalance ? account.currentBalance + transaction.debitAmount - transaction.creditAmount : transaction.debitAmount - transaction.creditAmount
          };

          const updatedCreditAccount = {
            ...account,
            transaction: account.transaction ? [...account.transaction, this.transactionToLedgerEntry(transaction)] : [this.transactionToLedgerEntry(transaction)],
            totalDebits: account.totalDebits ? account.totalDebits + transaction.debitAmount : transaction.debitAmount,
            totalCredits: account.totalCredits ? account.totalCredits + transaction.creditAmount : transaction.creditAmount,
            currentBalance: account.currentBalance ? account.currentBalance + transaction.creditAmount - transaction.debitAmount : transaction.creditAmount - transaction.debitAmount
          };

          if (account.normalSide === NormalSide.CREDIT) {
            console.log('Updating credit account:', updatedCreditAccount);
            return this.accountService.updateAccount(accountId, updatedCreditAccount);
          }else {
            console.log('Updating debit account:', updatedDebitAccount);
            return this.accountService.updateAccount(accountId, updatedDebitAccount);
          }
        });
          
        })
      }

  

  getAccounts() {
    return this.accountService.getAllAccounts();
  }

  // These methods would interact with your Firestore service
  private saveJournalEntry(entry: JournalEntry): Observable<void> {
    // Implement Firestore save
    return of(void 0);
  }

  private getJournalEntry(id: string): Observable<JournalEntry | null> {
    // Implement Firestore get
    return of(null);
  }

  private fetchJournalEntries(filters?: {
    status?: JournalEntryStatus;
    startDate?: Date;
    endDate?: Date;
  }): Observable<JournalEntry[]> {
    // // Get reference to Firestore
    // const journalCollection = collection(this.firestore, 'journalEntries');

    // // Start building query constraints
    // const constraints: QueryConstraint[] = [];

    // // Add filters if they exist
    // if (filters) {
    //   if (filters.status) {
    //     constraints.push(where('status', '==', filters.status));
    //   }

    //   if (filters.startDate) {
    //     constraints.push(where('date', '>=', filters.startDate));
    //   }

    //   if (filters.endDate) {
    //     constraints.push(where('date', '<=', filters.endDate));
    //   }
    // }

    // // Add default ordering
    // constraints.push(orderBy('date', 'desc'));

    // // Create the query
    // const journalQuery = query(journalCollection, ...constraints);

    // // Return the query result as an observable
    // return collectionData(journalQuery).pipe(
    //   map(entries => entries as JournalEntry[]),
    //   catchError(error => {
    //     console.error('Error fetching journal entries:', error);
    //     return of([]);
    //   })
    // );
    return this.journalService.getAllEntries();
  }


}
