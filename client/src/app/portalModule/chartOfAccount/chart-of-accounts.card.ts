import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AccountLedger } from "../../shared/dataModels/financialModels/account-ledger.model";

// chart-of-accounts-card.component.ts
@Component({
  selector: 'chart-of-accounts-card',
  template: `
  <div class="">
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
    <table *ngIf="accounts?.length" class=".main-container">
      <thead>
        <tr class="">
          <th class="">Account #</th>
          <th class="">Name</th>
          <th class="">Category</th>
          <th class="">Subcategory</th>
          <th class="">Balance</th>
          <th class="">Normal Side</th>
          <th class="">Status</th>
          <th class="">Actions</th>
        </tr>
      </thead>
      <tbody class="">
        <tr *ngFor="let account of accounts"
            class="">
          <td class="">{{account.accountNumber}}</td>
          <td class="">{{account.accountName}}</td>
          <td class="">{{account.category}}</td>
          <td class="">{{account.subcategory}}</td>
          <td class="">
            {{account.currentBalance | currency}}
          </td>
          <td class="">
            {{account.normalSide}}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            <span [class]="account.isActive ?
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800' :
              'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'">
              {{account.isActive ? 'Active' : 'Inactive'}}
            </span>
          </td>
          <td class="">
            <button
              (click)="handleEditAccount(account)"
              class="">
              <span class="material-icons text-sm">edit</span>
            </button>
            <button
              (click)="handleViewHistory(account)"
              class="">
              <span class="material-icons text-sm">history</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
    styleUrl: './chart-of-accounts.scss',
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
