// journal-entry-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AccountLedger, JournalEntry, JournalEntryStatus, JournalTransaction } from '../../../shared/dataModels/financialModels/account-ledger.model';

@Component({
  selector: 'journal-entry-form-card',
  template: `
  <div class="main-container">
    <div class="title-header">
      <h2 class="section-header-global">Create Journal Entry</h2>
    </div>
    <div class="header">
      <button class="button return" routerLink="/portal-dashboard"><mat-icon class="mat-icon">arrow_back</mat-icon> Return to Accounting Dashboard</button>
    </div>
    <div class="form-container">
      <form [formGroup]="journalEntryForm" (ngSubmit)="onSubmit()" class="space-y-6">

        <div class="form-grid">
          <!-- Entry Title -->
          <div>
            <label for="entryTitle" class="form-label">
              Entry Title
            </label>
            <input
              id="entryTitle"
              type="text"
              formControlName="entryTitle"
              class="form-input"
              placeholder="Enter Entry Title"
            >
            <div *ngIf="journalEntryForm.get('entryTitle')?.touched &&
                        journalEntryForm.get('entryTitle')?.invalid"
                 class="invalid-container">
              Entry Title is required
            </div>
          </div>

          <!-- Date -->
          <div>
            <label for="date" class="form-label">
              Date
            </label>
            <input
              id="date"
              type="date"
              formControlName="date"
              class="form-input"
            >
            <div *ngIf="journalEntryForm.get('date')?.touched &&
                        journalEntryForm.get('date')?.invalid"
                 class="invalid-container">
              Date is required
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div>
          <label for="description" class="form-label">
            Description
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="form-input"
            placeholder="Enter a description for this journal entry..."
          ></textarea>
          <div *ngIf="journalEntryForm.get('description')?.touched &&
                      journalEntryForm.get('description')?.invalid"
               class="invalid-container">
            Description is required
          </div>
        </div>

        <!-- Transactions Section -->
        <div formArrayName="transactions" class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="form-section-header">Transactions</h3>
            <button
              type="button"
              (click)="addTransaction()"
              class="gold-button"
            >
              Add Transaction
            </button>
          </div>

          <!-- Individual Transactions -->
          <div *ngFor="let transaction of transactions.controls; let i=index"
               [formGroupName]="i"
               class="transaction-box">
            <div class="transaction-grid">
              <!-- Account Selection -->
              <div>
                <label [for]="'accountId-' + i" class="form-label">
                  Account
                </label>
                <select
                  [id]="'accountId-' + i"
                  formControlName="accountId"
                  class="transaction-selection"
                >
                  <option value="" disabled selected>Select an account</option>
                  <option *ngFor="let account of accounts" [value]="account.accountNumber">
                    {{ account.accountName }} ({{ account.accountNumber }})
                  </option>
                </select>
              </div>

              <!-- Transaction Description -->
              <div>
                <label [for]="'description-' + i" class="form-label">
                  Description
                </label>
                <input
                  [id]="'description-' + i"
                  type="text"
                  formControlName="description"
                  class="transaction-selection"
                  placeholder="Transaction description"
                >
              </div>

              <!-- Debit Amount -->
              <div>
                <label [for]="'debitAmount-' + i" class="form-label">
                  Debit
                </label>
                <input
                  [id]="'debitAmount-' + i"
                  type="number"
                  formControlName="debitAmount"
                  class="transaction-selection"
                  min="0"
                  step="0.01"
                >
              </div>

              <!-- Credit Amount -->
              <div>
                <label [for]="'creditAmount-' + i" class="form-label">
                  Credit
                </label>
                <input
                  [id]="'creditAmount-' + i"
                  type="number"
                  formControlName="creditAmount"
                  class="transaction-selection"
                  min="0"
                  step="0.01"
                >
              </div>
            </div>

            <!-- Remove Transaction Button -->
            <div class="remove-container">
              <button
                type="button"
                (click)="removeTransaction(i)"
                class="remove-transaction"
                *ngIf="transactions.length > 1"
              >
                <mat-icon class="mat-icon">delete</mat-icon>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Totals Section -->
        <div class="totals-section">
          <div>
            <p class="totals-font">
              Total Debits: {{ calculateTotalDebits() | currency }}
            </p>
          </div>
          <div>
            <p class="totals-font">
              Total Credits: {{ calculateTotalCredits() | currency }}
            </p>
          </div>
        </div>

        <!-- Validation Messages -->
        <div class="space-y-2">
          <div *ngIf="!isBalanced() && journalEntryForm.touched"
               class="violation-message">
            Debits and credits must be equal
          </div>
          <div *ngIf="!validateTransactions() && journalEntryForm.touched"
               class="violation-message">
            Each transaction must have either a debit or credit amount, not both
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            (click)="journalEntryForm.reset()"
            class="slate-button"
          >
            Reset
          </button>
          <button
            type="submit"
            [disabled]="!canSubmit()"
            class="gold-button"
          >
            Submit Journal Entry
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
  styleUrl: './journal-entry-form-card.component.scss'
})

export class JournalEntryFormCard {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() accounts: AccountLedger[] | null = [] as AccountLedger[];

  journalEntryForm!: FormGroup;



  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  private createForm() {
    this.journalEntryForm = this.fb.group({
      entryTitle: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      description: ['', Validators.required],
      transactions: this.fb.array([])
    });

    // Add initial transaction
    this.addTransaction();
  }


  get transactions() {
    return this.journalEntryForm.get('transactions') as FormArray;
  }

  addTransaction() {
    const transaction = this.fb.group({
      accountId: ['', Validators.required],
      description: [''],
      debitAmount: [0, [Validators.min(0), Validators.required]],
      creditAmount: [0, [Validators.min(0), Validators.required]],
    });

    this.transactions.push(transaction);
  }

  isTransactionValid(transaction: any): boolean {
    return (
      (transaction.debitAmount > 0 && transaction.creditAmount === 0) ||
      (transaction.creditAmount > 0 && transaction.debitAmount === 0)
    );
  }

  calculateTotalDebits(): number {
    return this.transactions.controls
      .reduce((sum, transaction) => sum + (+transaction.get('debitAmount')?.value || 0), 0);
  }

  calculateTotalCredits(): number {
    return this.transactions.controls
      .reduce((sum, transaction) => sum + (+transaction.get('creditAmount')?.value || 0), 0);
  }


  validateTransactions(): boolean {
    return this.transactions.controls.every(control =>
      this.isTransactionValid(control.value)
    );
  }

  // Enhance balance check
  isBalanced(): boolean {
    const totalDebits = this.calculateTotalDebits();
    const totalCredits = this.calculateTotalCredits();
    return Math.abs(totalDebits - totalCredits) < 0.01; // Handle floating point precision
  }

  // Add helper methods for form state
  canSubmit(): boolean {
    return (
      this.journalEntryForm.valid &&
      this.isBalanced() &&
      this.validateTransactions() &&
      this.transactions.length > 0
    );
  }

  // Add method to remove transactions
  removeTransaction(index: number): void {
    this.transactions.removeAt(index);
  }

  onSubmit() {
    if (this.journalEntryForm.valid && this.isBalanced()) {
      const formValue = this.journalEntryForm.value as JournalEntryFormValue;

      const accountsFromTransactions = formValue.transactions.map((transaction: JournalTransaction) => transaction.accountId);

      // Prepare the journal entry object
      const journalEntry = {
        id: '',
        postReference: '',
        updatedBy: '',
        totalDebits: this.calculateTotalDebits(),
        totalCredits: this.calculateTotalCredits(),
        isBalanced: true,
        status: JournalEntryStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date(formValue.date),
        description: formValue.description,
        version: 1,
        versionHistory: [],
        createdBy: getAuth().currentUser?.uid || '',
        // Fixed: using formValue.transactions instead of transaction
        accounts: accountsFromTransactions,
        transactions: formValue.transactions.map((transaction: JournalTransaction) => ({
          id: crypto.randomUUID(), // Add unique ID for each transaction
          journalEntryId: '', // This will be set when the entry is saved
          accountId: transaction.accountId,
          description: transaction.description,
          debitAmount: Number(transaction.debitAmount) || 0,
          creditAmount: Number(transaction.creditAmount) || 0,
          createdAt: new Date(),
          createdBy: getAuth().currentUser?.uid || '',
          updatedAt: new Date(),
          updatedBy: getAuth().currentUser?.uid || ''
        }))
      } as JournalEntry;

      console.log(journalEntry);
      this.formSubmit.emit(journalEntry);
    }
  }
}


interface JournalEntryFormValue {
  entryTitle: string;
  date: string;
  description: string;
  transactions: JournalTransaction[];
}
