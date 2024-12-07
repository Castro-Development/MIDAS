import { Injectable } from "@angular/core";
import { RecurringAdjustingEntry } from "./adjusting-entry.model";
import { Firestore, collection, doc, getDoc, onSnapshot, setDoc } from "@angular/fire/firestore";
import { ErrorHandlingService } from "../../shared/error-handling/error-handling.service";
import { Observable } from "rxjs";



@Injectable({ providedIn: 'root' })
export class AdjustingEntryFirestoreService{

    private readonly COLLECTION_NAME = 'adjustingEntries';

    constructor(
        private firestore: Firestore,
        private errorHandlingService: ErrorHandlingService
    ) {}

    /*
     * Recurring Adjusting Entries
     */
    createRecurringAdjustingEntry(readjustingEntry: RecurringAdjustingEntry): Promise<void>{
        const docRef = doc(collection(this.firestore, this.COLLECTION_NAME), readjustingEntry.id);
        // Add to the recurring adjusting entries collection
        return setDoc(docRef, readjustingEntry);
        // Return the new recurring adjusting entry document ID & status
        
    }
    getRecurringAdjustingEntry(recurringEntryId: string): Observable<RecurringAdjustingEntry>{
        // Get a recurring adjusting entry by ID
        const docRef = doc(collection(this.firestore, this.COLLECTION_NAME), recurringEntryId);
        // Return the recurring adjusting entry document
        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(docRef, (snapshot) => {
                if(snapshot.exists()){
                    subscriber.next({...snapshot.data(), id: snapshot.id} as RecurringAdjustingEntry);
                } else {
                    throw new Error('No such document!');
                }
            })
            return () => unsubscribe();
        })
    }
    getRecurringAdjustingEntries(): Observable<RecurringAdjustingEntry[]>{
        // Get all recurring adjusting entries
        const collectionRef = collection(this.firestore, this.COLLECTION_NAME);
        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
                const entries = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as RecurringAdjustingEntry));
                subscriber.next(entries);
            })
            return () => unsubscribe();
        });

        // Return the recurring adjusting entries collection

    }
    updateRecurringAdjustingEntry(updatedEntry: Partial<RecurringAdjustingEntry>): Promise<void>{
        const docRef = doc(collection(this.firestore, this.COLLECTION_NAME), updatedEntry.id);
        return setDoc(docRef, updatedEntry, {merge: true});
        // Update a recurring adjusting entry
        // Return the updated recurring adjusting entry document ID & status
    }
    archiveRecurringAdjustingEntry(archivedEntryId: string): Promise<void>{
        // archive a recurring adjusting entry
        const docRef = doc(collection(this.firestore, 'archivedAdjustingEntries'), archivedEntryId);
        // Return the archived recurring adjusting entry document ID & status
        return setDoc(docRef, {archived: true});
    }

}