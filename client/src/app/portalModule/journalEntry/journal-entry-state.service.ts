import { BehaviorSubject, Observable, Subject, catchError, combineLatest, distinctUntilChanged, from, map, of, takeUntil } from "rxjs";
import { JournalEntry, JournalEntryStatus } from "../../shared/dataModels/financialModels/account-ledger.model";
import { Injectable, OnDestroy } from "@angular/core";
import { JournalEntryFirestoreService } from "./journal-firestore.service";
import { ErrorHandlingService } from "../../shared/errorHandling/error-handling.service";
import { FilteringService } from "../../shared/filter/filter.service";
import { Firestore, collection, getDocs, where } from "firebase/firestore";
import { query } from "@angular/fire/firestore";

  export interface JournalFilter{
    id?: string;
    entryNumber?: string;
    dateStart?: Date;
    dateEnd?: Date;
    status: JournalEntryStatus;
    createdBy?: string;
  }

  @Injectable({ providedIn: 'root' })
  export class JournalEntryStateService implements OnDestroy{
    
    private readonly journalEntriesSubject = new BehaviorSubject<JournalEntry[]>([] as JournalEntry[]);
    private filterSubject = new Subject<JournalFilter>();
    private destroyedSubject = new Subject<void>();

    private readonly journalEntries$ = this.journalEntriesSubject.asObservable();
    private readonly filter$ = this.filterSubject.asObservable();
    private readonly destroyed$ = this.destroyedSubject.asObservable();

    constructor(
      private journalEntryFirestoreService: JournalEntryFirestoreService,
      private errorHandlingService: ErrorHandlingService,
      private filterService: FilteringService,
      private firestore: Firestore
    ) {
      this.initializeJournalEntries();
    }
    
    initializeJournalEntries() {
      this.journalEntryFirestoreService.getAllEntries().subscribe( (journalEntries) => {
        this.journalEntriesSubject.next(journalEntries);
        takeUntil(this.destroyed$)
      })
    }

    ngOnDestroy(): void {
      this.journalEntriesSubject.complete();
      this.filterSubject.complete();
      this.destroyedSubject.next();
      this.destroyedSubject.complete();
    }
    
    readonly filteredJournalEntries$ = combineLatest([this.journalEntries$, this.filterSubject]).pipe(
      map(([journalEntries, filter]) => this.filterService.filter(journalEntries, filter, [
        'id',
        'entryNumber',
        'dateStart',
        'dateEnd',
        'status',
        'createdBy'
      ])),
      distinctUntilChanged(),
    );

    updateFilters(filter: JournalFilter) {
      this.filterSubject.next(filter);
    }

    getEntryByPostRef(postRef: string): Observable<JournalEntry | undefined> {
      return this.journalEntries$.pipe(
        map(journalEntries => journalEntries.find(entry => entry.postReference === postRef)),
        catchError(() => {
          console.warn('Failed to get journal entry state, querying by post reference');
          return this.journalEntryFirestoreService.getEntry(postRef).pipe(
            // Map null to undefined to match the return type
            map(entry => entry ?? {} as JournalEntry),
            catchError(() => this.errorHandlingService.handleError('Failed to get journal entry', undefined))
          )
        })
      );
    }

    getJournalEntriesForAccount(accountId: string): Observable<JournalEntry[]> {
      //TODO: Hide firestore access behind journalEntryFirestoreService
      const journalEntriesRef = collection(this.firestore, 'journalEntries');
      
      // Query for entries that have a transaction for this account
      return from(
        getDocs(
          query(journalEntriesRef, 
            where('transactions', 'array-contains-any', [{ accountId }])
          )
        )
      ).pipe(
        map(snapshot => 
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as JournalEntry))
        ),
        catchError(error => {
          console.error('Error fetching journal entries:', error);
          return of([]);
        })
      );
    }
    
  }