// journal-entry-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AccountLedger } from '../../../../shared/dataModels/financialModels/account-ledger.model';

@Component({
  selector: 'journal-entry-form-card',
  template: `
    <form [formGroup]="journalEntryForm" (ngSubmit)="onSubmit()" class="p-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- Basic Information -->
        <div class="col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label for="entryNumber" class="block white text-sm font-medium mb-1 white">Entry Number</label>
            <input 
              id="entryNumber" 
              type="text" 
              formControlName="entryNumber"
              class="w-full p-2 border rounded"
            >
          </div>
          <div>
            <label for="date" class="block text-sm font-medium mb-1 white">Date</label>
            <input 
              id="date" 
              type="date" 
              formControlName="date"
              class="w-full p-2 border rounded"
            >
          </div>
        </div>

        <!-- Description -->
        <div class="col-span-2">
          <label for="description" class="color-black block text-sm font-medium mb-1 white">Description</label>
          <textarea 
            id="description" 
            formControlName="description"
            class="w-full p-2 border rounded"
            rows="3"
            placeholder="Enter a description for this journal entry..."
          ></textarea>
        </div>

        <!-- Transactions -->
        <div class="col-span-2">
          <h3 class="text-lg font-medium mb-2 white">Transactions</h3>
          <div formArrayName="transactions">
            <div *ngFor="let transaction of transactions.controls; let i=index" 
                 [formGroupName]="i"
                 class="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label [for]="'accountId-' + i" class="block text-sm font-medium mb-1 white">Account</label>
                <input 
                  [id]="'accountId-' + i" 
                  type="text" 
                  formControlName="accountId"
                  class="w-full p-2 border rounded"
                >
              </div>
              <div>
                <label [for]="'description-' + i" class="block text-sm font-medium mb-1 white">Description</label>
                <input 
                  [id]="'description-' + i" 
                  type="text" 
                  formControlName="description"
                  class="w-full p-2 border rounded"
                >
              </div>
              <div>
                <label [for]="'debitAmount-' + i" class="block text-sm font-medium mb-1 white">Debit</label>
                <input 
                  [id]="'debitAmount-' + i" 
                  type="number" 
                  formControlName="debitAmount"
                  class="w-full p-2 border rounded"
                >
              </div>
              <div>
                <label [for]="'creditAmount-' + i" class="block text-sm font-medium mb-1 white">Credit</label>
                <input 
                  [id]="'creditAmount-' + i" 
                  type="number" 
                  formControlName="creditAmount"
                  class="w-full p-2 border rounded"
                >
              </div>
            </div>
          </div>
          <button 
            type="button" 
            (click)="addTransaction()"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Transaction
          </button>
        </div>

        <!-- Totals Display -->
        <div class="col-span-2 grid grid-cols-2 gap-4 mt-4">
          <div>
            <p class="font-medium gold">Total Debits: {{ calculateTotalDebits() }}</p>
          </div>
          <div>
            <p class="font-medium gold">Total Credits: {{ calculateTotalCredits() }}</p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="col-span-2">
          <button 
            type="submit" 
            [disabled]="!journalEntryForm.valid || !isBalanced()"
            class="w-full px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            Submit Journal Entry
          </button>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./journal-entry-form-card.component.scss']
})
export class JournalEntryFormCard {
  @Output() formSubmit = new EventEmitter<any>();
  @Input() accounts: AccountLedger[] = [] as AccountLedger[];

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
      debitAmount: [0, [Validators.min(0)]],
      creditAmount: [0, [Validators.min(0)]]
    });

    this.transactions.push(transaction);
  }

  calculateTotalDebits(): number {
    return this.transactions.controls
      .reduce((sum, transaction) => sum + (+transaction.get('debitAmount')?.value || 0), 0);
  }

  calculateTotalCredits(): number {
    return this.transactions.controls
      .reduce((sum, transaction) => sum + (+transaction.get('creditAmount')?.value || 0), 0);
  }

  isBalanced(): boolean {
    return this.calculateTotalDebits() === this.calculateTotalCredits();
  }

  onSubmit() {
    if (this.journalEntryForm.valid && this.isBalanced()) {
      const formValue = this.journalEntryForm.value;
      
      // Prepare the journal entry object
      const journalEntry = {
        ...formValue,
        totalDebits: this.calculateTotalDebits(),
        totalCredits: this.calculateTotalCredits(),
        isBalanced: true,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        versionHistory: [],
        createdBy: getAuth().currentUser?.uid
      };

      this.formSubmit.emit(journalEntry);
    }
  }
}