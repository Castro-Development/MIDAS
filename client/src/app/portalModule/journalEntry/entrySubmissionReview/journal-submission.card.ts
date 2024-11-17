import { Component, Input, Output, EventEmitter } from "@angular/core";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";

// journal-entry-detail.component.ts
@Component({
    selector: 'journal-detail-card',
    template: `
      <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <!-- Header -->
        <div class="mb-6 border-b pb-4">
          <h2 class="text-2xl font-bold text-gray-900">Journal Entry Details</h2>
          <p class="text-sm text-gray-500">Created: {{convertTimestamp(journalEntry?.createdAt) | date:'medium'}}</p>
        </div>
  
        <!-- Entry Details -->
        <div class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Entry ID</label>
              <p class="mt-1 text-gray-900">{{journalEntry?.id}}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <p class="mt-1">
                <span [ngClass]="journalEntry?.isBalanced ? 
                  'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'"
                  class="px-3 py-1 rounded-full text-xs">
                  {{journalEntry?.isBalanced ? 'Balanced' : 'Unbalanced'}}
                </span>
              </p>
            </div>
          </div>
  
          <!-- Description -->
          <div>
            <label class="text-sm font-medium text-gray-700">Description</label>
            <p class="mt-1 text-gray-900">{{journalEntry?.description}}</p>
          </div>
  
          <!-- Transactions Table -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Transactions</h3>
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let transaction of journalEntry?.transactions">
                  <td class="px-6 py-4 text-sm text-gray-900">{{transaction.accountId}}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{transaction.description}}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 text-right">
                    {{transaction.debitAmount | currency}}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 text-right">
                    {{transaction.creditAmount | currency}}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="2" class="px-6 py-4 text-sm font-medium text-gray-900 text-right">Totals:</td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {{journalEntry?.totalDebits | currency}}
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    {{journalEntry?.totalCredits | currency}}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
  
          <!-- Approval Actions -->
          <div class="mt-8 flex justify-end space-x-4">
            <button 
              (click)="denyEntry()"
              class="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
            >
              Deny Entry
            </button>
            <button 
              (click)="approveEntry()"
              [disabled]="!journalEntry?.isBalanced"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Approve Entry
            </button>
          </div>
        </div>
  
        <!-- Denial Dialog -->
        <div *ngIf="showDenialDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Deny Journal Entry</h3>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Reason for Denial
              </label>
              <textarea
                [(ngModel)]="denialReason"
                rows="4"
                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide a reason for denying this entry..."
              ></textarea>
            </div>
            <div class="flex justify-end space-x-4">
              <button
                (click)="showDenialDialog = false"
                class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                (click)="confirmDenial()"
                [disabled]="!denialReason"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  export class JournalSubmissionCard {
    @Input() journalEntry: JournalEntry | null = null;
    @Output() approved = new EventEmitter<void>();
    @Output() denied = new EventEmitter<string>();
  
    showDenialDialog = false;
    denialReason = '';
  
    convertTimestamp(timestamp: any): Date {
      return timestamp?.toDate?.() || timestamp;
    }
  
    approveEntry(): void {
      if (this.journalEntry?.isBalanced) {
        this.approved.emit();
      }
    }
  
    denyEntry(): void {
      this.showDenialDialog = true;
    }
  
    confirmDenial(): void {
      if (this.denialReason) {
        this.denied.emit(this.denialReason);
        this.showDenialDialog = false;
        this.denialReason = '';
      }
    }
  }