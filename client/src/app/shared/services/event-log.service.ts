import { Injectable } from "@angular/core";
import { EventType } from "./event-bus.service"
import { FirestoreLogService } from "./firestoreService/log-firestore.service";
import { AccountAccessEvent } from "../dataModels/loggingModels/event-logging.model";


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


}