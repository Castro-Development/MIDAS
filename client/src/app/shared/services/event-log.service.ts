import { Injectable } from "@angular/core";
import { FirestoreLogService } from "./firestoreService/log-firestore.service";
import { AccountAccessEvent, AccountEventLog, EventMetadata, EventType } from "../dataModels/loggingModels/event-logging.model";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class EventLogService {
    
    
    constructor(
        private firestoreLogService: FirestoreLogService
    ) { }

    logEvent(eventType: EventType, payload: any) {
        switch(eventType) {
            case EventType.ACCOUNT_ACCESS:
                this.logAccountAccess(payload as AccountAccessEvent);
                break;
            case EventType.ACCOUNT_CREATED:
                this.logAccountCreationEvent(payload);
                break;
            case EventType.ACCOUNT_DEACTIVATED:
                this.logAccountDeactivation(payload);
                break;
        }
    }

    logAccountAccess(payload: AccountAccessEvent) {
        throw new Error("Method not implemented.");
    }

    logAccountCreationEvent(payload: any) {
        throw new Error("Method not implemented.");
    }

    logAccountDeactivation(payload: any) {
        throw new Error("Method not implemented.");
    }

    getAccountEventLog(accountId: string, filter: any): Observable<AccountEventLog> {
        throw new Error("Method not implemented.");
    }

    getEventDetails(eventId: string): Observable<EventMetadata> {
        throw new Error("Method not implemented.");
    }

    logAccountEventLogAccess(arg0: AccountAccessEvent): void {
        throw new Error("Method not implemented.");
    }
}