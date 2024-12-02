import { Component, OnDestroy, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { JournalEntryFacade } from "../journal-entries.facade";
import { Router } from "@angular/router";

@Component({
    selector: 'app-journal-entry-form',
    template: `
        <ng-container *ngIf="!selectedEntry; else entryDetail">
            <journal-review-card
                [journalEntries$]="journalEntries$"
                (chosenJournalEntry)="selectEntry($event)"
            ></journal-review-card>
        </ng-container>

        <ng-template #entryDetail>
            <journal-detail-card
                [journalEntry]="selectedEntry"
                (approved)="handleApproval($event)"
                (denied)="handleDenial($event)"
            ></journal-detail-card>
        </ng-template>
    `,
    styleUrl: './journal-entry-review.scss',
})
export class JournalEntryReviewComponent implements OnDestroy {
    private journalFacade = inject(JournalEntryFacade);
    private router = inject(Router);

    journalEntries$ = this.journalFacade.loadEntries();
    selectedEntry: JournalEntry | null = null;

    private destroySubject = new BehaviorSubject<void>(undefined);

    selectEntry(entry: JournalEntry): void {
        this.selectedEntry = entry;
    }

    handleApproval(journalEntry: JournalEntry): void {
        if (journalEntry !== null) {
            console.log('Approving entry', journalEntry);
            this.journalFacade.approveEntry(journalEntry);
        }else {
            console.log('No entry to approve');
        }
    }

    handleDenial(reason: string): void {
        if (this.selectedEntry) {
            this.journalFacade.rejectEntry(this.selectedEntry.id, reason)
                .subscribe(() => {
                    this.selectedEntry = null;
                    // Optionally refresh the entries list
                });
        }
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }
}
