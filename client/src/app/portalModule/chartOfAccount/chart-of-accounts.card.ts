import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AccountLedger } from "../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'chart-of-accounts-card',
    template: `
        <!-- Accounts Table -->
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 text-left border">Account #</th>
          <th class="p-2 text-left border">Name</th>
          <th class="p-2 text-left border">Category</th>
          <th class="p-2 text-left border">Subcategory</th>
          <th class="p-2 text-right border">Balance</th>
          <th class="p-2 text-center border">Normal Side</th>
          <th class="p-2 text-center border">Status</th>
          <th class="p-2 text-center border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let account of accounts" class="hover:bg-gray-50">
          <td class="p-2 border">{{account.accountNumber}}</td>
          <td class="p-2 border">{{account.accountName}}</td>
          <td class="p-2 border">{{account.category}}</td>
          <td class="p-2 border">{{account.subcategory}}</td>
          <td class="p-2 border text-right">
            {{account.currentBalance}}
          </td>
          <td class="p-2 border text-center">{{account.normalSide}}</td>
          <td class="p-2 border text-center">
            <span 
              [class]="account.isActive ? 'text-green-600' : 'text-red-600'"
            >
              {{account.isActive ? 'Active' : 'Inactive'}}
            </span>
          </td>
          <td class="p-2 border text-center">
            <button (click)="handleEditAccount(account)" class="text-blue-600 mx-1">
              Edit
            </button>
            <button (click)="handleViewHistory(account)" class="text-green-600 mx-1">
              History
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    `,
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
        this.editAccount.emit(account);
    }

    handleViewHistory(account: AccountLedger): void {
        this.viewHistory.emit(account);
    }
}