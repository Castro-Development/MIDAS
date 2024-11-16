import { Injectable, OnDestroy, inject } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, collection, doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, catchError, map, take, takeUntil } from 'rxjs';
import { Account, AccountFilter, GeneralLedger, JournalEntry } from '../../shared/dataModels/financialModels/account-ledger.model';
import { ErrorHandlingService } from '../../shared/errorHandling/error-handling.service';
import { AccountBalance } from '../../facades/accountFacades/account-balance.facade';

@Injectable({
  providedIn: 'root'
})
export class JournalEntryFirestoreService implements OnDestroy {

  private journalEntriesSubject = new BehaviorSubject<JournalEntry[]>([]);

  readonly journalEntries$ = this.journalEntriesSubject.asObservable();

  private destroySubject = new Subject<void>();

  constructor(
    firestore: Firestore,
    private errorHandlingService: ErrorHandlingService) {
    this.initializeAccountFirestoreService(firestore, errorHandlingService);
   }
  

   initializeAccountFirestoreService(firestore: Firestore, errorHandlingService: ErrorHandlingService){ 
    //Create subscription to the generalLedgers collection snapshot
    onSnapshot(collection(firestore, 'journalEntries'), (snapshot) => {
      takeUntil(this.destroySubject);
      const journalEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as JournalEntry);
      catchError(error => {
        errorHandlingService.handleError(error, [] as JournalEntry[]);
        return [];
      });
      this.journalEntriesSubject.next(journalEntries);
    });
   }

   

   ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}