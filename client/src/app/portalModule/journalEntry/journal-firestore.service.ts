import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';
import { JournalEntry } from '../../shared/dataModels/financialModels/account-ledger.model';

@Injectable({
  providedIn: 'root'
})
export class JournalEntryFirestoreService {
  private readonly COLLECTION_NAME = 'journalEntries';
  
  constructor(
    private firestore: Firestore,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getEntry(postRef: string): Observable<JournalEntry | null> {
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(
        doc(collection(this.firestore, this.COLLECTION_NAME), postRef),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            subscriber.next({ id: docSnapshot.id, ...docSnapshot.data() } as JournalEntry);
          } else {
            subscriber.next(null);
          }
        },
        error => {
          this.errorHandlingService.handleError('Failed to get journal entry', error);
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  getAllEntries(): Observable<JournalEntry[]> {
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(
        collection(this.firestore, this.COLLECTION_NAME),
        (snapshot) => {
          const entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as JournalEntry));
          subscriber.next(entries);
        },
        error => {
          this.errorHandlingService.handleError('Failed to get journal entries', error);
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async createEntry(entry: JournalEntry): Promise<void> {
    try {
      const entryRef = doc(
        collection(this.firestore, this.COLLECTION_NAME), 
        entry.postReference // Using postRef as the document ID
      );

      await setDoc(entryRef, {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to create journal entry', error);
      throw error;
    }
  }

  async updateEntry(postRef: string, changes: Partial<JournalEntry>): Promise<void> {
    try {
      const entryRef = doc(
        collection(this.firestore, this.COLLECTION_NAME), 
        postRef
      );

      await updateDoc(entryRef, {
        ...changes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to update journal entry', error);
      throw error;
    }
  }
}