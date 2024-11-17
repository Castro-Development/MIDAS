import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { AsyncPipe } from "@angular/common";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'journal-review-card',
    template: `
    <br><br>
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <!--<th>Timestamp</th>-->
          <th>Date</th>
          <th>Created By</th>
          <th>Entry ID</th>
          <th>Total Debits</th>
          <th>Total Credits</th>
          <th>Balanced?</th>
          <th></th>
        </tr>
      </thead>
    <ng-container *ngIf="(journalEntries$ | async) as journalEntriesList">
        <tr *ngFor="let journalEntry of journalEntriesList" class="hover:bg-gray-50">
          <td class="p-2 border">{{journalEntry.createdAt}}</td>
          <td class="p-2 border">{{journalEntry.createdBy}}</td>
          <td class="p-2 border">{{journalEntry.dateCreated}}</td>
          <td class="p-2 border">{{journalEntry.id}}</td>
          <td class="p-2 border text-right">
            {{journalEntry.totalDebits}}
          </td>
          <td class="p-2 border text-right">
            {{journalEntry.totalCredits}}
          </td>
          <td class="p-2 border text-center">{{journalEntry.isBalanced}}</td>
          <td class="p-2 border text-center">
            <span 
              [class]="journalEntry.isBalanced ? 'text-green-600' : 'text-red-600'"
            >
              {{journalEntry.isBalanced}}
            </span>
          </td>
          <td class="p-2 border text-center">
            <button (click)="chooseJournalEntry(journalEntry)" class="text-blue-600 mx-1">
              Edit
            </button>
          </td>
        </tr>
      </ng-container>
    `
})
export class JournalReviewCard implements OnInit{
    
    @Input() journalEntries$?: Observable<JournalEntry[]> = undefined;
    @Output() chosenJournalEntry = new EventEmitter<JournalEntry>();

    chooseJournalEntry(journalEntry: JournalEntry) {
        this.chosenJournalEntry.emit(journalEntry);
    }

    ngOnInit(): void {
      console.log(this.journalEntries$);
    }
}