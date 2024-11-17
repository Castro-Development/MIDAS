import { Injectable } from "@angular/core";
import { FirestoreLogService } from "./log-firestore.service";
import { AccountAccessEvent, AccountCreationEvent, AccountEvent, AccountEventLog, AccountUpdateEvent, EventMetadata, EventType, JournalEntrySubmissionEvent } from "../dataModels/loggingModels/event-logging.model";
import { Observable } from "rxjs";
import { JournalTransaction } from "../dataModels/financialModels/account-ledger.model";


@Injectable({
    providedIn: 'root'
})
export class EventLogService {
    logJournalEntryRejection(arg0: { type: EventType; payload: null; dateRejected: Date; journalEntryId: string; reason: string; }) {
      throw new Error('Method not implemented.');
    }
    logJournalEntryApproval(arg0: { type: EventType; payload: null; dateApproved: Date; journalEntryId: string; }) {
      throw new Error('Method not implemented.');
    }
    
    
    
    
    
    
    
    constructor(
        private firestoreLogService: FirestoreLogService
    ) { }
    //---------------------------------//
    /* * * * * Account Events * * * * */
    //---------------------------------//

    logAccountAccess(payload: AccountAccessEvent) {
        this.firestoreLogService.logAccountEvent(payload);
    }

    logAccountUpdate(payload: AccountUpdateEvent) {
        this.firestoreLogService.logAccountEvent(payload);
    }

    logAccountCreationEvent(payload: AccountCreationEvent) {
        this.firestoreLogService.logAccountEvent(payload);
    }

    logAccountDeactivation(payload: any) {
        this.firestoreLogService.logAccountEvent(payload);
    }

    logAccountEventLogAccess(payload: AccountAccessEvent): void {
        throw new Error("Method not implemented.");
    }

    logPendingAccountTransaction(arg0: JournalTransaction) {
        throw new Error('Method not implemented.');
    }

    //---------------------------------//
    /* * * * * Journal Events * * * * */
    //---------------------------------//

    logJournalEntrySubmission(payload: JournalEntrySubmissionEvent) {
        throw new Error('Method not implemented.');
      }

    //------------------------------//
    /* * * * * User Events * * * * */
    //------------------------------//

    logUserEvent(payload: any) {
        throw new Error("Method not implemented.");
    }

    logError(type: EventType, payload: any) {
        throw new Error("Method not implemented.");
      }



}