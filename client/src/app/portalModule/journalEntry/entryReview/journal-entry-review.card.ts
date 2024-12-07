import { Component, OnInit, Input, Output, EventEmitter, inject } from "@angular/core";
import { Observable } from "rxjs";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { Timestamp } from "firebase/firestore";
import { Router } from "@angular/router";

@Component({
    selector: 'journal-review-card',
    template: `
    <div class="main-container">
      <div class="title-header">
        <h2 class="section-header-global">Journal Review</h2>

      </div>
      <div class="header">
        <button class="button return" routerLink="/portal-dashboard"><mat-icon class="mat-icon">arrow_back</mat-icon> Return to Accounting Dashboard</button>
        <!-- <button class="button create-user">Create New User</button> -->
      </div>
      <!-- Table -->
      <table class="">
        <thead>
          <tr class="">
            <th class="">Date Created</th>
            <th class="">Description</th>
            <th class="">Entry ID</th>
            <th class="">Total Debits</th>
            <th class="">Total Credits</th>
            <th class="">Balanced?</th>
            <th class="">Approval Status</th>
            <th class="">Review Entry</th>
          </tr>
        </thead>
        <tbody class="">
          <ng-container *ngIf="journalEntries$ | async as entries">
            <tr *ngFor="let entry of getPaginatedEntries(entries)"
                class="">
              <td class="">
                {{convertTimestamp(entry.createdAt) | date:'medium'}}
              </td>
              <td class="">{{entry.description}}</td>
              <td class="">{{entry.id}}</td>
              <td class="">
                {{entry.totalDebits | currency}}
              </td>
              <td class="">
                {{entry.totalCredits | currency}}
              </td>
              <td class="">
                <span [ngClass]="entry.isBalanced ?
                  'balanced' :
                  'unbalanced'"
                  class="status"  matTooltip="Journal Entry Status">
                  {{entry.isBalanced ? 'Balanced' : 'Unbalanced'}}
                </span>
              </td>
              <td>{{entry.status}}</td>
              <td class="">
                <!-- <button (click)="chosenJournalEntry.emit(entry)"
                  class="" *ngIf="entry.status == 'DRAFT'"> -->
                  <button (click)="chosenJournalEntry.emit(entry)"
                  class="" *ngIf="entry.status == 'DRAFT'"  matTooltip="Verify Journal">

                  <span class="material-icons">edit</span>
                </button>
                <mat-icon *ngIf="entry.status != 'DRAFT'" (click)="chosenJournalEntry.emit(entry)"  matTooltip="View journal (cannot edit)">visibility</mat-icon>
              </td>
            </tr>
            <tr *ngIf="entries.length === 0" class="text-center">
              <td colspan="7" class="">
                No journal entries found
              </td>
            </tr>
          </ng-container>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="pagination">
        <div class="inner-page">
          <!-- Mobile Pagination -->
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="page-button1"
            [class.opacity-50]="currentPage === 1"
          >
            Previous
          </button>
          <button
            (click)="nextPage()"
            [disabled]="isLastPage"
            class="page-button1"
            [class.opacity-50]="isLastPage"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <!-- Desktop Pagination -->
          <div>
            <p class="current-page">
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
                class="prev"
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
                  class="pagenum"
                >
                  {{ page }}
                </button>
              </ng-container>

              <button
                (click)="nextPage()"
                [disabled]="isLastPage"
                class="next"
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
    `,
    styleUrl: './journal-entry-review.scss',

  })
  export class JournalReviewCard implements OnInit {
    @Input() journalEntries$?: Observable<JournalEntry[]> = undefined;
    @Output() chosenJournalEntry = new EventEmitter<JournalEntry>();

    router = inject(Router);

    // Pagination properties
    currentPage = 1;
    itemsPerPage = 10;
    totalItems = 0;
    isLastPage = false;

    chooseJournalEntry(journalEntry: JournalEntry) {
      this.chosenJournalEntry.emit(journalEntry);
    }

    convertTimestamp(timestamp: Date | Timestamp): Date {
      if (timestamp instanceof Date) return timestamp;
      return timestamp.toDate();
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

    reviewJournal(journal: JournalEntry) {
      this.router.navigate(['/journal-detail-card'], { queryParams: { data: JSON.stringify(journal)} });
    }


  }
