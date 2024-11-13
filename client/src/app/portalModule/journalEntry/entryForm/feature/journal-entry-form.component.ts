import { Component, inject } from "@angular/core";
import { Firestore, collection } from "@angular/fire/firestore";
import { addDoc } from "firebase/firestore";
import { Router } from "@angular/router";

@Component({
    selector: 'app-journal-entry-form',
    template: `
    <div class="journal-entry-form">
        <journal-entry-form-card 
        (formSubmit)="handleJournalEntry($event)">
        </journal-entry-form-card>
    </div>
    `
})
export class JournalEntryFormComponent {
    private firestore = inject(Firestore);
    private router = inject(Router);
    constructor() {}

    handleJournalEntry(journalEntry: any) {
        const journalEntryCollectionRef = collection(this.firestore, 'journalEntries');
        addDoc(journalEntryCollectionRef, journalEntry);
        this.router.navigate(['/journal-entry-review']);
    }

}