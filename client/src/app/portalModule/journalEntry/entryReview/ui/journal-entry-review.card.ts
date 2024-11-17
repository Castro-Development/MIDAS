import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { JournalEntry } from "../../../../shared/dataModels/financialModels/account-ledger.model";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { AsyncPipe } from "@angular/common";

// journal-review-card.component.ts
@Component({
  selector: 'journal-review-card',
  template: `
  <div class="p-6">
      <table class="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead>
              <tr class="bg-gray-50 text-gray-600 text-sm leading-normal">
                  <th class="py-3 px-6 text-left">Date Created</th>
                  <th class="py-3 px-6 text-left">Created By</th>
                  <th class="py-3 px-6 text-left">Entry ID</th>
                  <th class="py-3 px-6 text-right">Total Debits</th>
                  <th class="py-3 px-6 text-right">Total Credits</th>
                  <th class="py-3 px-6 text-center">Status</th>
                  <th class="py-3 px-6 text-center">Actions</th>
              </tr>
          </thead>
          <tbody class="text-gray-600 text-sm">
              <ng-container *ngIf="journalEntries$ | async as entries">
                  <tr *ngFor="let entry of entries" 
                      class="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                      <td class="py-3 px-6 text-left">
                          {{entry.createdAt | date:'medium'}}
                      </td>
                      <td class="py-3 px-6 text-left">{{entry.createdBy}}</td>
                      <td class="py-3 px-6 text-left">{{entry.id}}</td>
                      <td class="py-3 px-6 text-right">
                          {{entry.totalDebits | currency}}
                      </td>
                      <td class="py-3 px-6 text-right">
                          {{entry.totalCredits | currency}}
                      </td>
                      <td class="py-3 px-6 text-center">
                          <span [ngClass]="entry.isBalanced ? 
                              'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'"
                              class="px-3 py-1 rounded-full text-xs">
                              {{entry.isBalanced ? 'Balanced' : 'Unbalanced'}}
                          </span>
                      </td>
                      <td class="py-3 px-6 text-center">
                          <button (click)="chosenJournalEntry.emit(entry)"
                              class="text-blue-600 hover:text-blue-800 transition duration-150">
                              <span class="material-icons text-sm">edit</span>
                          </button>
                      </td>
                  </tr>
                  <tr *ngIf="entries.length === 0" class="text-center">
                      <td colspan="7" class="py-8 text-gray-500">
                          No journal entries found
                      </td>
                  </tr>
              </ng-container>
          </tbody>
      </table>
  </div>
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