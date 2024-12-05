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
import { ErrorHandlingService } from '../../shared/error-handling/error-handling.service';
import { JournalEntry } from '../../shared/dataModels/financialModels/account-ledger.model';
import { addDoc } from 'firebase/firestore';

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
      // Log the collection path to verify
      console.log('Collection path:', this.COLLECTION_NAME);
      
      const unsubscribe = onSnapshot(
        collection(this.firestore, this.COLLECTION_NAME),
        (snapshot) => {
          // Add debugging for each document
          snapshot.docs.forEach(doc => {
            console.log('Document ID:', doc.id);
            console.log('Document data:', doc.data());
          });
          
          const entries = snapshot.docs.map(doc => {
            // Create the object more explicitly for debugging
            const data = doc.data();
            const entry = {
              ...data,
              id: doc.id,  // This should never be empty if doc exists
              
            } as JournalEntry;
            
            // Log each transformed entry
            console.log('Transformed entry:', entry);
            return entry;
          });
          
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
      const entryRef = collection(this.firestore, this.COLLECTION_NAME)

      await addDoc(entryRef, {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to create journal entry', error);
      throw error;
    }
  }

  async updateEntry(id: string, changes: Partial<JournalEntry>): Promise<void> {
    console.log('updating entry', id, changes);
    try {
      const entryRef = doc(
        collection(this.firestore, this.COLLECTION_NAME), 
        id
      );

      await updateDoc(entryRef, {
        ...changes,
        updatedAt: serverTimestamp()
      }).then(() => {
        console.log('Document successfully updated!');
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to update journal entry', error);
      throw error;
    }
  }
}