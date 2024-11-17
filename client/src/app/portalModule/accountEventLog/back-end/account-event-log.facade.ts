import { Injectable } from "@angular/core";
import { FirestoreLogService } from "../../../shared/eventLog/log-firestore.service";


@Injectable({
    providedIn: 'root'
})
export class AccountEventLogFacade {

    constructor(
        private firestoreLogService: FirestoreLogService
    ) {}
    getAllAccountEvents(accountId: string) {
        this.firestoreLogService.getAccountEvents(accountId);
    }
}