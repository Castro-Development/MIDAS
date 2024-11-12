import { Injectable } from "@angular/core";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { Notification } from "../../states/notification-state.service";
import { doc, Firestore, onSnapshot, collection, QuerySnapshot } from "@angular/fire/firestore";
import { AccountEvent, JournalEntryEvent, UserEvent } from "../../dataModels/loggingModels/event-logging.model";

@Injectable({ providedIn: 'root' })
export class FirestoreLogService {

  logAccountEvent(event: AccountEvent) {
    throw new Error("Method not implemented.");
  }

  logJournalEntryEvent(event: JournalEntryEvent) {
    throw new Error("Method not implemented.");
  }

  logUserEvent(event: UserEvent) {
    throw new Error("Method not implemented.");
  }

}