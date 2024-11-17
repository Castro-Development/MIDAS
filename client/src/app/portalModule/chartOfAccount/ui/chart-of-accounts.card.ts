import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AccountLedger } from "../../../shared/dataModels/financialModels/account-ledger.model";

// chart-of-accounts-card.component.ts
@Component({
  selector: 'chart-of-accounts-card',
  template: `
  <div class="overflow-x-auto">
    <!-- Loading State -->
    <div *ngIf="!accounts" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading accounts...</p>
    </div>

    <!-- Empty State -->
    <div *ngIf="accounts?.length === 0" class="p-8 text-center">
      <p class="text-gray-600">No accounts found</p>
    </div>

    <!-- Accounts Table -->
    <table *ngIf="accounts?.length" class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account #</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Side</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr *ngFor="let account of accounts" 
            class="hover:bg-gray-50 transition-colors duration-200">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{account.accountNumber}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{account.accountName}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{account.category}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{account.subcategory}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
            {{account.currentBalance | currency}}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
            {{account.normalSide}}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            <span [class]="account.isActive ? 
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800' : 
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'">
              {{account.isActive ? 'Active' : 'Inactive'}}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
            <button 
              (click)="handleEditAccount(account)" 
              class="text-blue-600 hover:text-blue-900 mx-2 transition-colors duration-200">
              <span class="material-icons text-sm">edit</span>
            </button>
            <button 
              (click)="handleViewHistory(account)" 
              class="text-green-600 hover:text-green-900 mx-2 transition-colors duration-200">
              <span class="material-icons text-sm">history</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class ChartOfAccountsCard implements OnInit {
    @Input() accounts: AccountLedger[] | null = [];
    @Output() selectedAccount = new EventEmitter<AccountLedger>();
    @Output() editAccount = new EventEmitter<AccountLedger>();
    @Output() viewHistory = new EventEmitter<AccountLedger>();

    constructor() {}

    ngOnInit(): void {
        // Remove the throw error if you don't need special initialization
    }

    // Add these methods to handle the events
    handleEditAccount(account: AccountLedger): void {
        this.selectedAccount.emit(account);
    }

    handleViewHistory(account: AccountLedger): void {
        this.selectedAccount.emit(account);
    }
}