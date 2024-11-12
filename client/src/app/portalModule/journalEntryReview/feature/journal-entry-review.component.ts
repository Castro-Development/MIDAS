// journal-entry-form.component.ts
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { collection, doc, Firestore, getDocs } from "@angular/fire/firestore";
import { onSnapshot } from "firebase/firestore";
import { JournalEntryFacade } from "../../../shared/facades/transactionManagementFacades/journal-entries.facade";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { Router } from "@angular/router";

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
    private firestore = inject(Firestore);
    private journalEntriesSubject = new Subject<JournalEntry[]>();
    private journalFacade = inject(JournalEntryFacade);
    readonly journalEntries$: Observable<JournalEntry[]> = this.journalEntriesSubject.asObservable();
    private router = inject(Router);

    private destroySubject = new BehaviorSubject<void>(undefined);

    constructor () {
        this.initializeJournalEntrySubscription();
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }


    private initializeJournalEntrySubscription() {
        this.journalFacade.loadEntries().subscribe(entries => {
            this.journalEntriesSubject.next(entries);
        });
    }

    routeToJournalEntry(journalEntry: JournalEntry) {
        this.journalFacade.selectEntry(journalEntry);
        this.router.navigate(['/journal-entry', journalEntry.id]);
    }

}


    