import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, switchMap } from "rxjs";
import { Notification } from "../notification/notification-state.service";
import { doc, Firestore, onSnapshot, collection, QuerySnapshot, setDoc, query, where } from "@angular/fire/firestore";
import { AccountEvent, JournalEntryEvent, UserEvent } from "../dataModels/loggingModels/event-logging.model";
import { addDoc } from "firebase/firestore";

@Injectable({ providedIn: 'root' })
export class FirestoreLogService {
  

  constructor(
    private firestore: Firestore) { }

  logAccountEvent(event: AccountEvent) {
    const eventCollectionRef = collection(this.firestore, 'events', 'accountEvents', event.accountId);
    addDoc(eventCollectionRef, event);
  }

  logJournalEntryEvent(event: JournalEntryEvent) {
    const eventCollectionRef = collection(this.firestore, 'events', 'journalEvents', event.postRef);
    addDoc(eventCollectionRef, event);
  }

  logUserEvent(event: UserEvent) {
    const eventCollectionRef = collection(this.firestore, 'events', 'userEvents', event.userId);
    addDoc(eventCollectionRef, event);
  }

  getAccountEvents(accountId: string): Observable<AccountEvent[]> {
    const eventCollectionRef = collection(this.firestore, 'events', 'accountEvents');
    return new Observable(subscriber => {
      // Use collection query instead of single doc
      const unsubscribe = onSnapshot(
        query(eventCollectionRef, where('accountId', '==', accountId)), 
        snapshot => {
          const events = snapshot.docs.map(doc => doc.data() as AccountEvent);
          subscriber.next(events);
        }
      );
      return unsubscribe;
    });
  }
    
}

