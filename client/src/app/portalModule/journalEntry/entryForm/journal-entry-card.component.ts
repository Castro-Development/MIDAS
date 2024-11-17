// journal-entry-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AccountLedger, JournalEntryStatus, JournalTransaction } from '../../../shared/dataModels/financialModels/account-ledger.model';

@Component({
  selector: 'journal-entry-form-card',
  template: `
    <div class="p-6 bg-gray-900">
      <form [formGroup]="journalEntryForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Header Section -->
        <div class="text-xl font-bold text-white mb-6">
          Create Journal Entry
        </div>

        <!-- Basic Information Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Entry Number -->
          <div>
            <label for="entryNumber" class="block text-sm font-medium text-white mb-2">
              Entry Number
            </label>
            <input 
              id="entryNumber" 
              type="text" 
              formControlName="entryNumber"
              class="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter entry number"
            >
            <div *ngIf="journalEntryForm.get('entryNumber')?.touched && 
                        journalEntryForm.get('entryNumber')?.invalid"
                 class="text-red-500 text-sm mt-1">
              Entry number is required
            </div>
          </div>

          <!-- Date -->
          <div>
            <label for="date" class="block text-sm font-medium text-white mb-2">
              Date
            </label>
            <input 
              id="date" 
              type="date" 
              formControlName="date"
              class="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <div *ngIf="journalEntryForm.get('date')?.touched && 
                        journalEntryForm.get('date')?.invalid"
                 class="text-red-500 text-sm mt-1">
              Date is required
            </div>
          </div>
        </div>

        <!-- Description Section -->
        <div>
          <label for="description" class="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <textarea 
            id="description" 
            formControlName="description"
            rows="3"
            class="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a description for this journal entry..."
          ></textarea>
          <div *ngIf="journalEntryForm.get('description')?.touched && 
                      journalEntryForm.get('description')?.invalid"
               class="text-red-500 text-sm mt-1">
            Description is required
          </div>
        </div>

        <!-- Transactions Section -->
        <div formArrayName="transactions" class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-white">Transactions</h3>
            <button 
              type="button" 
              (click)="addTransaction()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                     transition-colors duration-200"
            >
              Add Transaction
            </button>
          </div>

          <!-- Individual Transactions -->
          <div *ngFor="let transaction of transactions.controls; let i=index" 
               [formGroupName]="i"
               class="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Account Selection -->
              <div>
                <label [for]="'accountId-' + i" class="block text-sm font-medium text-white mb-2">
                  Account
                </label>
                <select 
                  [id]="'accountId-' + i" 
                  formControlName="accountId"
                  class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled selected>Select an account</option>
                  <option *ngFor="let account of accounts" [value]="account.accountNumber">
                    {{ account.accountName }} ({{ account.accountNumber }})
                  </option>
                </select>
              </div>

              <!-- Transaction Description -->
              <div>
                <label [for]="'description-' + i" class="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <input 
                  [id]="'description-' + i" 
                  type="text" 
                  formControlName="description"
                  class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Transaction description"
                >
              </div>

              <!-- Debit Amount -->
              <div>
                <label [for]="'debitAmount-' + i" class="block text-sm font-medium text-white mb-2">
                  Debit
                </label>
                <input 
                  [id]="'debitAmount-' + i" 
                  type="number" 
                  formControlName="debitAmount"
                  class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                >
              </div>

              <!-- Credit Amount -->
              <div>
                <label [for]="'creditAmount-' + i" class="block text-sm font-medium text-white mb-2">
                  Credit
                </label>
                <input 
                  [id]="'creditAmount-' + i" 
                  type="number" 
                  formControlName="creditAmount"
                  class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                >
              </div>
            </div>

            <!-- Remove Transaction Button -->
            <div class="flex justify-end">
              <button 
                type="button"
                (click)="removeTransaction(i)"
                class="text-red-500 hover:text-red-400 transition-colors duration-200"
                *ngIf="transactions.length > 1"
              >
                <span class="material-icons">delete</span>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Totals Section -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div>
            <p class="text-lg font-medium text-yellow-500">
              Total Debits: {{ calculateTotalDebits() | currency }}
            </p>
          </div>
          <div>
            <p class="text-lg font-medium text-yellow-500">
              Total Credits: {{ calculateTotalCredits() | currency }}
            </p>
          </div>
        </div>

        <!-- Validation Messages -->
        <div class="space-y-2">
          <div *ngIf="!isBalanced() && journalEntryForm.touched" 
               class="p-3 bg-red-900 text-red-200 rounded-md">
            Debits and credits must be equal
          </div>
          <div *ngIf="!validateTransactions() && journalEntryForm.touched"
               class="p-3 bg-red-900 text-red-200 rounded-md">
            Each transaction must have either a debit or credit amount, not both
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <button 
            type="button"
            (click)="journalEntryForm.reset()"
            class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700
                   transition-colors duration-200"
          >
            Reset
          </button>
          <button 
            type="submit" 
            [disabled]="!canSubmit()"
            class="px-6 py-2 bg-green-600 text-white rounded-md 
                   hover:bg-green-700 transition-colors duration-200
                   disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Submit Journal Entry
          </button>
        </div>
      </form>
    </div>
  `
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
      entryNumber: ['', Validators.required],
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
      
      // Prepare the journal entry object
      const journalEntry = {
        ...formValue,
        totalDebits: this.calculateTotalDebits(),
        totalCredits: this.calculateTotalCredits(),
        isBalanced: true,
        status: JournalEntryStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        versionHistory: [],
        createdBy: getAuth().currentUser?.uid || '',
        // Fixed: using formValue.transactions instead of transaction
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
      };

      this.formSubmit.emit(journalEntry);
    }
  }
}


interface JournalEntryFormValue {
  entryNumber: string;
  date: string;
  description: string;
  transactions: JournalTransaction[];
}