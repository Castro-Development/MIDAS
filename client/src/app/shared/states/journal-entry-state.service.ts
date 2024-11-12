import { BehaviorSubject, Observable, Subject, catchError, combineLatest, distinctUntilChanged, from, map, of } from "rxjs";
import { JournalEntry, JournalEntryStatus } from "../dataModels/financialModels/account-ledger.model";
import { Injectable } from "@angular/core";
import { JournalEntryFirestoreService } from "../services/firestoreService/journal-firestore.service";
import { ErrorHandlingService } from "../services/error-handling.service";
import { FilteringService } from "../services/filter.service";
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
  export class JournalEntryStateService {
    
    private readonly journalEntriesSubject = new BehaviorSubject<JournalEntry[]>([] as JournalEntry[]);
    private filterSubject = new Subject<JournalFilter>();
    private readonly journalEntries$ = this.journalEntriesSubject.asObservable();
  


    private filteredJournalEntriesSubject = new BehaviorSubject<JournalEntry[]>([]);

    constructor(
      private journalEntryFirestoreService: JournalEntryFirestoreService,
      private errorHandlingService: ErrorHandlingService,
      private filterService: FilteringService,
      private firestore: Firestore
    ) {
      this.initializeJournalEntries(journalEntryFirestoreService, errorHandlingService);
    }
    
    initializeJournalEntries(journalEntryService: JournalEntryFirestoreService, errorHandlingService: ErrorHandlingService) {
      journalEntryService.journalEntries$.subscribe(
        (journalEntries) => {
          this.journalEntriesSubject.next(journalEntries);
        }
      );
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
      );
      //This should return the journal entry that corresponds to the account creation post reference, which is that postRef: string
      // Should just need to search the journalEntries for a transaction that has that postRef
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