import { Injectable } from "@angular/core";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { doc, Firestore, onSnapshot, collection, QuerySnapshot, addDoc } from "@angular/fire/firestore";
import { AccountEvent, EventType, JournalEntryEvent, UserEvent } from "../dataModels/loggingModels/event-logging.model";

@Injectable({ providedIn: 'root' })
export class FirestoreLogService {
  
  private readonly COLLECTION_NAME = 'logs';

  constructor(private firestore: Firestore) { }

  logAccountEvent(event: AccountEvent) {
    const accountEventCollectionRef = collection(this.firestore, this.COLLECTION_NAME, event.accountId, 'events');

    return addDoc(accountEventCollectionRef, event);
  }

  logJournalEntryEvent(event: JournalEntryEvent) {
    throw new Error("Method not implemented.");
  }

  logUserEvent(event: UserEvent) {
    throw new Error("Method not implemented.");
  }

  logError(type: EventType, payload: any) {
    const errorCollectionRef = collection(this.firestore, this.COLLECTION_NAME, type.toString(), 'errors');

    return addDoc(errorCollectionRef, {
      type,
      payload,
      createdAt: new Date()
    });
}

}