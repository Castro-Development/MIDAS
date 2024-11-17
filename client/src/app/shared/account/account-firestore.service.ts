import { Injectable, OnDestroy, inject } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, collection, doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, catchError, map, take, takeUntil } from 'rxjs';
import { AccountLedger, AccountFilter, GeneralLedger, JournalEntry } from '../dataModels/financialModels/account-ledger.model';
import { ErrorHandlingService } from '../errorHandling/error-handling.service';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AccountFirestoreService {
  
  constructor(
    private firestore: Firestore,
    private errorHandlingService: ErrorHandlingService) {
   }
  
   getAccount(id: string): Observable<AccountLedger> {
    const accountRef = doc(collection(this.firestore, 'generalLedger'), id);
    return new Observable(subscriber => {
      onSnapshot(accountRef, {
        next: (snapshot) => {
          const account = snapshot.data() as AccountLedger;
          subscriber.next(account);
        },
        error: (error) => subscriber.error(error)
      });
    });
   }

   getAllAccounts(): Observable<AccountLedger[]> {
    const accountsCollectionRef = collection(this.firestore, 'generalLedger');
    return new Observable(subscriber => {
      onSnapshot(accountsCollectionRef, {
        next: (snapshot) => {
          const accounts = snapshot.docs.map(doc => doc.data() as AccountLedger);
          subscriber.next(accounts);
        },
        error: (error) => subscriber.error(error)
      });
    });
   }

   createAccount(account: AccountLedger): Promise<AccountLedger> {
    const accountDocRef = doc(collection(this.firestore, 'generalLedger'), account.accountNumber);
    return setDoc(accountDocRef, account).then(() => { return account });
   }

   deactivateAccount(id: string): Promise<void> {
    const accountRef = doc(collection(this.firestore, 'generalLedger'), id);
    return updateDoc(accountRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });
   }

   updateAccount(id: string, account: Partial<AccountLedger>): Promise<void> {
    const accountRef = doc(collection(this.firestore, 'generalLedger'), id);
    return updateDoc(accountRef, {
      ...account,
      updatedAt: serverTimestamp()
    });
   }

}
