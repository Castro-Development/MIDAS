// account-creation.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Account, AccountCategory } from '../../../../shared/dataModels/financialModels/account-ledger.model';
@Component({
  selector: 'account-creation-card',
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6">Create New Account</h2>

      <form [formGroup]="accountForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Account Number -->
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Account Number*
            </label>
            <input
              type="text"
              formControlName="accountNumber"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('accountNumber')"
            >
            <div *ngIf="isFieldInvalid('accountNumber')" class="text-red-500 text-sm mt-1">
              Account number is required and must be unique
            </div>
          </div>

          <!-- Account Name -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Account Name*
            </label>
            <input
              type="text"
              formControlName="accountName"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('accountName')"
            >
            <div *ngIf="isFieldInvalid('accountName')" class="text-red-500 text-sm mt-1">
              Account name is required
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            formControlName="description"
            rows="3"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="isFieldInvalid('description')"
          ></textarea>
          <div *ngIf="isFieldInvalid('description')" class="text-red-500 text-sm mt-1">
            Description is required
          </div>
        </div>

        <!-- Category and Subcategory -->
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              formControlName="category"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('category')"
              (change)="onCategoryChange()"
            >
              <option value="">Select Category</option>
              <option *ngFor="let category of categories" [value]="category">
                {{category}}
              </option>
            </select>
            <div *ngIf="isFieldInvalid('category')" class="text-red-500 text-sm mt-1">
              Category is required
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Subcategory*
            </label>
            <select
              formControlName="subcategory"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('subcategory')"
            >
              <option value="">Select Subcategory</option>
              <option *ngFor="let subcategory of subcategories" [value]="subcategory">
                {{subcategory}}
              </option>
            </select>
            <div *ngIf="isFieldInvalid('subcategory')" class="text-red-500 text-sm mt-1">
              Subcategory is required
            </div>
          </div>
        </div>

        <!-- Normal Side and Initial Balance -->
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Normal Side*
            </label>
            <select
              formControlName="normalSide"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('normalSide')"
            >
              <option value="">Select Normal Side</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
            <div *ngIf="isFieldInvalid('normalSide')" class="text-red-500 text-sm mt-1">
              Normal side is required
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Initial Balance*
            </label>
            <input
              type="number"
              formControlName="initialBalance"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('initialBalance')"
              step="0.01"
            >
            <div *ngIf="isFieldInvalid('initialBalance')" class="text-red-500 text-sm mt-1">
              Initial balance is required and must be a valid number
            </div>
          </div>
        </div>

        <!-- Status and Date -->
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                formControlName="isActive"
                class="rounded text-blue-600 focus:ring-blue-500"
              >
              <span>Account Active</span>
            </label>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Date Added
            </label>
            <input
              type="date"
              formControlName="dateAdded"
              class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- Comments -->
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Comments
          </label>
          <textarea
            formControlName="comments"
            rows="2"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            (click)="onReset()"
            class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            [disabled]="!accountForm.valid"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  `
})
export class AccountCreationCard implements OnInit {
  accountForm: FormGroup = new FormGroup({
    accountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3,6}$')]),
    accountName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    normalSide: new FormControl('', Validators.required),
    initialBalance: new FormControl(0, [Validators.required, Validators.min(0)]),
    isActive: new FormControl(true),
    dateAdded: new FormControl('', Validators.required),
    comments: new FormControl('')
  });
  @Output() accountCreated = new EventEmitter<Account>();

  
  subcategoriesMap = {
    'ASSET': [
      'Current Assets',
      'Fixed Assets',
      'Intangible Assets',
      'Other Assets'
    ],
    'LIABILITY': [
      'Current Liabilities',
      'Long-term Liabilities',
      'Other Liabilities'
    ],
    'EQUITY': [
      'Common Stock',
      'Retained Earnings',
      'Additional Paid-in Capital'
    ],
    'REVENUE': [
      'Operating Revenue',
      'Non-operating Revenue'
    ],
    'EXPENSE': [
      'Operating Expenses',
      'Administrative Expenses',
      'Selling Expenses',
      'Financial Expenses'
    ]
  };

    categories: AccountCategory[] = Object.values(AccountCategory);

    subcategories: string[] = [];

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    // Set default date to today
    this.accountForm.patchValue({
      dateAdded: new Date().toISOString().split('T')[0],
      isActive: true
    });
  }

  createForm() {
    this.accountForm = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{3,6}$')]],
      accountName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      normalSide: ['', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      dateAdded: ['', Validators.required],
      comments: ['']
    });
  }

  onCategoryChange() {
    const category = this.accountForm.get('category')?.value;
    this.subcategories = this.subcategoriesMap[category as AccountCategory] || [];
    this.accountForm.patchValue({ subcategory: '' });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.accountForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.accountCreated.emit(this.accountForm.value);
      // Optionally reset the form after submission
      // this.onReset();
    } else {
      this.markFormGroupTouched(this.accountForm);
    }
  }

  onReset() {
    this.accountForm.reset({
      dateAdded: new Date().toISOString().split('T')[0],
      isActive: true,
      initialBalance: 0
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}