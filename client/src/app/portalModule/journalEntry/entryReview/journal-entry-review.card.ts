import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'journal-review-card',
    template: `
    <div class="p-6">
      <!-- Table -->
      <table class="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-sm leading-normal">
            <th class="py-3 px-6 text-left">Date Created</th>
            <th class="py-3 px-6 text-left">Description</th>
            <th class="py-3 px-6 text-left">Entry ID</th>
            <th class="py-3 px-6 text-right">Total Debits</th>
            <th class="py-3 px-6 text-right">Total Credits</th>
            <th class="py-3 px-6 text-center">Status</th>
            <th class="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm">
          <ng-container *ngIf="journalEntries$ | async as entries">
            <tr *ngFor="let entry of getPaginatedEntries(entries)"
                class="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
              <td class="py-3 px-6 text-left">
                {{convertTimestamp(entry.createdAt) | date:'medium'}}
              </td>
              <td class="py-3 px-6 text-left">{{entry.description}}</td>
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
  
      <!-- Pagination Controls -->
      <div class="mt-4 flex items-center justify-between bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <!-- Mobile Pagination -->
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            [class.opacity-50]="currentPage === 1"
          >
            Previous
          </button>
          <button
            (click)="nextPage()"
            [disabled]="isLastPage"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            [class.opacity-50]="isLastPage"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <!-- Desktop Pagination -->
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                (click)="previousPage()"
                [disabled]="currentPage === 1"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                [class.opacity-50]="currentPage === 1"
              >
                <span class="sr-only">Previous</span>
                <span class="material-icons text-sm">chevron_left</span>
              </button>
              
              <!-- Page Numbers -->
              <ng-container *ngFor="let page of getPageNumbers()">
                <button
                  (click)="goToPage(page)"
                  [class.bg-blue-600]="currentPage === page"
                  [class.text-white]="currentPage === page"
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  {{ page }}
                </button>
              </ng-container>
  
              <button
                (click)="nextPage()"
                [disabled]="isLastPage"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                [class.opacity-50]="isLastPage"
              >
                <span class="sr-only">Next</span>
                <span class="material-icons text-sm">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    `
  })
  export class JournalReviewCard implements OnInit {
    @Input() journalEntries$?: Observable<JournalEntry[]> = undefined;
    @Output() chosenJournalEntry = new EventEmitter<JournalEntry>();
  
    // Pagination properties
    currentPage = 1;
    itemsPerPage = 10;
    totalItems = 0;
    isLastPage = false;
  
    chooseJournalEntry(journalEntry: JournalEntry) {
      this.chosenJournalEntry.emit(journalEntry);
    }
  
    convertTimestamp(timestamp: any): Date {
      return timestamp?.toDate?.() || timestamp;
    }
  
    ngOnInit(): void {
      this.journalEntries$?.subscribe(entries => {
        this.totalItems = entries?.length || 0;
        this.updatePaginationState();
      });
    }
  
    // Pagination methods
    getPaginatedEntries(entries: JournalEntry[]): JournalEntry[] {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return entries.slice(start, end);
    }
  
    get startIndex(): number {
      return (this.currentPage - 1) * this.itemsPerPage;
    }
  
    get endIndex(): number {
      return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    }
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePaginationState();
      }
    }
  
    nextPage(): void {
      if (!this.isLastPage) {
        this.currentPage++;
        this.updatePaginationState();
      }
    }
  
    goToPage(page: number): void {
      this.currentPage = page;
      this.updatePaginationState();
    }
  
    getPageNumbers(): number[] {
      const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    private updatePaginationState(): void {
      const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.isLastPage = this.currentPage >= totalPages;
    }
  }