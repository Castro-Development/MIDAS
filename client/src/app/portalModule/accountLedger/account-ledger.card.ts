import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { AccountLedger, LedgerEntry } from "../../shared/dataModels/financialModels/account-ledger.model";
import { JournalEntryFacade } from "../journalEntry/journal-entries.facade";
import { ErrorHandlingService } from "../../shared/error-handling/error-handling.service";

@Component({
    selector: 'account-ledger-card',
    template: `
    <!-- Header Section -->
    <div class="p-6 bg-white">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Account Ledger</h1>
          <p class="text-gray-600">Account #{{accountLedger.accountNumber}} - {{accountLedger.accountName}}</p>
        </div>

        <div class="flex gap-2">
          <button mat-stroked-button (click)="openFilters()">
            <mat-icon>filter_list</mat-icon>
            Filters
          </button>
          <button mat-stroked-button (click)="exportData()">
            <mat-icon>download</mat-icon>
            Export
          </button>
        </div>
      </div>

      <!-- Balance Cards -->
      <mat-card class="mb-6">
        <mat-card-content>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-600">Opening Balance</p>
              <p class="text-lg font-semibold">{{accountLedger.openingBalance | currency}}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Current Balance</p>
              <p class="text-lg font-semibold">{{accountLedger.currentBalance | currency}}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Pending Transactions</p>
              <p class="text-lg font-semibold text-blue-600">{{pendingCount}}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Transactions Table -->
      <mat-card>
        <mat-card-content>
          <ng-container *ngIf="accountLedger?.transaction?.length">
            <table class="w-full min-w-full divide-y divide-gray-200">
              <!-- Table Header -->
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">PR</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Docs</th>
                </tr>
              </thead>
              
              <!-- Table Body -->
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let entry of paginatedEntries" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">{{entry.date | date:'shortDate'}}</td>
                  <td class="px-6 py-4">{{entry.description}}</td>
                  <td class="px-6 py-4 text-right">{{entry.debitAmount | currency:'USD':'symbol':'1.2-2'}}</td>
                  <td class="px-6 py-4 text-right">{{entry.creditAmount | currency:'USD':'symbol':'1.2-2'}}</td>
                  <td class="px-6 py-4 text-right font-medium">
                    {{calculateRunningBalance(entry) | currency:'USD':'symbol':'1.2-2'}}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button mat-button color="primary" (click)="viewJournalEntry(entry.journalEntryId)">
                      {{entry.journalEntryId || 'N/A'}}
                    </button>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button mat-icon-button *ngIf="entry.hasDocuments" (click)="viewDocuments(entry)">
                      <mat-icon>description</mat-icon>
                    </button>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr *ngIf="!accountLedger?.transaction?.length">
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No entries found
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="flex justify-between items-center mt-4 px-6">
              <div class="text-sm text-gray-700">
                Showing {{currentPage * pageSize + 1}} to {{Math.min((currentPage + 1) * pageSize, accountLedger.transaction?.length || 0)}} 
                of {{accountLedger.transaction?.length || 0}} entries
              </div>
              <div class="flex gap-2">
                <button mat-button 
                        [disabled]="currentPage === 0"
                        (click)="currentPage = currentPage - 1">
                  Previous
                </button>
                <button mat-button 
                        [disabled]="(accountLedger.transaction?.length || 0) <= (currentPage + 1) * pageSize"
                        (click)="currentPage = currentPage + 1">
                  Next
                </button>
              </div>
            </div>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
    `,
})
export class AccountLedgerCard {
    @Input() accountLedger!: AccountLedger;
    @Output() selectedAccount = new EventEmitter<AccountLedger>();
    @Output() editAccount = new EventEmitter<AccountLedger>();
    @Output() viewHistory = new EventEmitter<AccountLedger>();

    journalEntryFacade = inject(JournalEntryFacade);
    Math = Math;
    
    pageSize = 10;
    currentPage = 0;

    get pendingCount(): number {
        return this.accountLedger.transaction?.filter(entry => !entry.journalEntryId).length ?? 0;
    }

    get paginatedEntries(): any[] {
        return this.accountLedger.transaction?.slice(
            this.currentPage * this.pageSize,
            (this.currentPage + 1) * this.pageSize
        ) ?? [];
    }

    constructor(private errorHandling: ErrorHandlingService) {}

    calculateRunningBalance(entry: any): number {
        // You might want to implement a more sophisticated running balance calculation
        return entry.debitAmount - entry.creditAmount;
    }

    openFilters() {
        // Implement filter dialog
    }

    exportData() {
        // Implement export functionality
    }

    viewDocuments(entry: any) {
        console.log(`Viewing documents for entry dated: ${entry.date}`);
    }

    viewJournalEntry(postReference: string): void {
        if (postReference) {
            this.journalEntryFacade.selectEntry(postReference);
        }
    }
}