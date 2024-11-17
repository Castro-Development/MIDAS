// journal-entry-form.component.ts
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { collection, doc, Firestore, getDocs } from "@angular/fire/firestore";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { Router } from "@angular/router";
import { JournalEntryFacade } from "../journal-entries.facade";

@Component({
    selector: 'app-journal-entry-form',
    template: `
        <journal-review-card
            [journalEntries$]="journalEntries$"
            (chosenJournalEntry)="routeToJournalEntry($event)"
        ></journal-review-card>
    `
})
export class JournalEntryReviewComponent implements OnDestroy {
    private journalFacade = inject(JournalEntryFacade);
    private router = inject(Router);

    journalEntries$ = this.journalFacade.loadEntries();

    private destroySubject = new BehaviorSubject<void>(undefined);

    constructor () {
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }



    routeToJournalEntry(journalEntry: JournalEntry) {
        this.journalFacade.selectEntry(journalEntry.postReference);
        this.router.navigate(['/journal-entry', journalEntry.id]);
    }

}


    