import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  query
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { ErrorHandlingService } from '../../../shared/error-handling/error-handling.service';
import { AccountLedger } from '../../../shared/dataModels/financialModels/account-ledger.model';

@Injectable({
  providedIn: 'root'
})
export class AccountFirestoreService {
  private readonly COLLECTION_NAME = 'generalLedger';

  constructor(
    private firestore: Firestore,
    private errorHandlingService: ErrorHandlingService
  ) {}

  // Core single-document operations
  getAccount(accountId: string): Observable<AccountLedger | null> {
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(
        doc(collection(this.firestore, this.COLLECTION_NAME), accountId),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            subscriber.next({ documentId: docSnapshot.id, ...docSnapshot.data() } as AccountLedger);
          } else {
            subscriber.next(null);
          }
        },
        error => {
          this.errorHandlingService.handleError('Failed to get account', error);
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  getAllAccounts(): Observable<AccountLedger[]> {
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(
        collection(this.firestore, this.COLLECTION_NAME),
        (snapshot) => {
          const accounts = snapshot.docs.map(doc => ({
            documentId: doc.id,
            ...doc.data()
          } as AccountLedger));
          subscriber.next(accounts);
        },
        error => {
          this.errorHandlingService.handleError('Failed to get accounts', error);
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async createAccount(account: AccountLedger): Promise<void> {
    try {
      const accountRef = doc(
        collection(this.firestore, this.COLLECTION_NAME),
        account.accountNumber
      );

      await setDoc(accountRef, {
        ...account,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to create account', error);
      throw error;
    }
  }

  async updateAccount(accountId: string, changes: Partial<AccountLedger>): Promise<void> {
    try {
      const accountRef = doc(
        collection(this.firestore, this.COLLECTION_NAME),
        accountId
      );

      await updateDoc(accountRef, {
        ...changes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to update account', error);
      throw error;
    }
  }

  async deactivateAccount(accountId: string): Promise<void> {
    try {
      const accountRef = doc(
        collection(this.firestore, this.COLLECTION_NAME),
        accountId
      );

      await updateDoc(accountRef, {
        isDeleted: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to delete account', error);
      throw error;
    }
  }

  // Batch operations if needed
  async batchGetAccounts(accountIds: string[]): Promise<AccountLedger[]> {
    try {
      const accounts: AccountLedger[] = [];
      for (const id of accountIds) {
        const docSnap = await getDoc(
          doc(collection(this.firestore, this.COLLECTION_NAME), id)
        );
        if (docSnap.exists()) {
          accounts.push({ documentId: docSnap.id, ...docSnap.data() } as AccountLedger);
        }
      }
      return accounts;
    } catch (error) {
      this.errorHandlingService.handleError('Failed to batch get accounts', error);
      throw error;
    }
  }
}
