import { Component, inject } from "@angular/core";
import { Firestore, collection } from "@angular/fire/firestore";
import { addDoc } from "firebase/firestore";
import { Router } from "@angular/router";
import { AccountLedgerFacade } from "../../accountLedger/back-end/facade/account-ledger.facade";
import { JournalEntryFacade } from "../journal-entries.facade";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'app-journal-entry-form',
    template: `
    <div class="journal-entry-form">
        <journal-entry-form-card 
        [accounts]="accounts$ | async"
        (formSubmit)="handleJournalEntry($event)">
        </journal-entry-form-card>
    </div>
    `
})
export class JournalEntryFormComponent {
    journalFacade = inject(JournalEntryFacade);
    private router = inject(Router);
    constructor() {}

    accounts$ = this.journalFacade.getAccounts();

    handleJournalEntry(journalEntry: JournalEntry) {
        this.journalFacade.saveEntryDraft(journalEntry);
        this.router.navigate(['/portal/journal-entry-review']);
    }

}