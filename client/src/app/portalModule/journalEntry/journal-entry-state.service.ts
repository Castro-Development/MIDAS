import { BehaviorSubject, Observable, Subject, catchError, combineLatest, distinctUntilChanged, from, map, of, tap } from "rxjs";
import { JournalEntry, JournalEntryStatus } from "../../shared/dataModels/financialModels/account-ledger.model";
import { Injectable } from "@angular/core";
import { JournalEntryFirestoreService } from "./journal-firestore.service";
import { ErrorHandlingService } from "../../shared/error-handling/error-handling.service";
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
  export class JournalEntryStateService {
    
    
    
    private readonly journalEntriesSubject = new BehaviorSubject<JournalEntry[]>([] as JournalEntry[]);
    private readonly selectedEntrySubject = new BehaviorSubject<JournalEntry>({} as JournalEntry);
    private filterSubject = new Subject<JournalFilter>();
    private readonly journalEntries$ = this.journalEntriesSubject.asObservable();
  


    private filteredJournalEntriesSubject = new BehaviorSubject<JournalEntry[]>([]);

    constructor(
      private journalEntryFirestoreService: JournalEntryFirestoreService,
      private errorHandlingService: ErrorHandlingService,
      private filterService: FilteringService
    ) {
      this.initializeJournalEntries(journalEntryFirestoreService, errorHandlingService);
    }
    
    initializeJournalEntries(journalEntryService: JournalEntryFirestoreService, errorHandlingService: ErrorHandlingService) {
      journalEntryService.getAllEntries().pipe(
        tap(entries => this.journalEntriesSubject.next(entries)),
        distinctUntilChanged(),
      )
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

    selectEntry(entry: JournalEntry) {
      this.selectedEntrySubject.next(entry);
    }

    saveEntryDraft(journalEntry: JournalEntry): Promise<string> {
      const journalDraft = {
        ...journalEntry,
        status: JournalEntryStatus.DRAFT,
        postReference: journalEntry.createdBy.slice(0, 3).toUpperCase() + journalEntry.date + '-DRAFT',
      }
      return this.journalEntryFirestoreService.createEntry(journalDraft).then(
        () => {
          console.log('Journal draft saved')
          return journalDraft.postReference;
        }
      )
    }

    getEntryByPostRef(postRef: string): Observable<JournalEntry | undefined> {
      return this.journalEntries$.pipe(
        map(journalEntries => journalEntries.find(entry => entry.postReference === postRef)),
      );
      //This should return the journal entry that corresponds to the account creation post reference, which is that postRef: string
      // Should just need to search the journalEntries for a transaction that has that postRef
  }

    getJournalEntriesForAccount(accountId: string): Observable<JournalEntry[]> {
      return this.journalEntryFirestoreService.getAllEntries().pipe(
        map(entries => entries.filter(entry => entry.accounts.includes(accountId))),
      )
    }
    
  }