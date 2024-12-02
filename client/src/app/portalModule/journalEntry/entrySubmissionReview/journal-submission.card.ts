import { Component, Input, Output, EventEmitter } from "@angular/core";
import { JournalEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";

// journal-entry-detail.component.ts
@Component({
    selector: 'journal-detail-card',
    template: `
      <div class="review-container">
        <!-- Header -->
        <div class="title-container">
          <h2 class="title">Journal Entry Details</h2>
          <p class="date">Created: {{convertTimestamp(journalEntry?.createdAt) | date:'medium'}}</p>
        </div>

        <!-- Entry Details -->
        <div class="entry-details">
          <!-- Basic Info -->
          <div class="basic-info">
            <div>
              <label class="info-label">Entry ID</label>
              <p class="entry-desc">{{journalEntry?.id}}</p>
            </div>
            <div>
              <label class="info-label">Status</label>
              <p class="mt-1">
                <span [ngClass]="journalEntry?.isBalanced ?
                  'balanced' :
                  'unbalanced'"
                  class="journal-entry">
                  {{journalEntry?.isBalanced ? 'Balanced' : 'Unbalanced'}}
                </span>
              </p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="info-label">Description</label>
            <p class="entry-desc">{{journalEntry?.description}}</p>
          </div>

          <!-- Transactions Table -->
          <div>
            <h3 class="transaction-header">Transactions</h3>
            <table class="min-w-full table-split">
              <thead>
                <tr>
                  <th class="account-label">Account</th>
                  <th class="account-label">Description</th>
                  <th class="debit-label">Debit</th>
                  <th class="debit-label">Credit</th>
                </tr>
              </thead>
              <tbody class="table-split">
                <tr *ngFor="let transaction of journalEntry?.transactions">
                  <td class="transaction-info">{{transaction.accountId}}</td>
                  <td class="px-6 py-4 date">{{transaction.description}}</td>
                  <td class="transaction-info text-right">
                    {{transaction.debitAmount | currency}}
                  </td>
                  <td class="transaction-info text-right">
                    {{transaction.creditAmount | currency}}
                  </td>
                </tr>
              </tbody>
              <tfoot class="totals-highlight">
                <tr>
                  <td colspan="2" class="totals">Totals:</td>
                  <td class="totals">
                    {{journalEntry?.totalDebits | currency}}
                  </td>
                  <td class="totals">
                    {{journalEntry?.totalCredits | currency}}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Approval Actions -->
          <div class="approval">
            <button
              (click)="denyEntry()"
              class="approve"
            >
              Deny Entry
            </button>
            <button
              (click)="approveEntry()"
              [disabled]="!journalEntry?.isBalanced"
              class="deny"
            >
              Approve Entry
            </button>
          </div>
        </div>

        <!-- Denial Dialog -->
        <div *ngIf="showDenialDialog" class="denial">
          <div class="denial-content">
            <h3 class="deny-title">Deny Journal Entry</h3>
            <div class="mb-4">
              <label class="reason-label">
                Reason for Denial
              </label>
              <textarea
                [(ngModel)]="denialReason"
                rows="4"
                class="reason-input"
                placeholder="Please provide a reason for denying this entry..."
              ></textarea>
            </div>
            <div class="reason-button-container">
              <button
                (click)="showDenialDialog = false"
                class="cancel-button"
              >
                Cancel
              </button>
              <button
                (click)="confirmDenial()"
                [disabled]="!denialReason"
                class="confirm-button"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    styleUrl: './journal-submission.component.scss',
  })
  export class JournalSubmissionCard {
    @Input() journalEntry: JournalEntry | null = null;
    @Output() approved = new EventEmitter<JournalEntry>();
    @Output() denied = new EventEmitter<string>();

    showDenialDialog = false;
    denialReason = '';

    convertTimestamp(timestamp: any): Date {
      return timestamp?.toDate?.() || timestamp;
    }

    approveEntry(): void {
      if (this.journalEntry?.isBalanced) {
        this.approved.emit(this.journalEntry);
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
