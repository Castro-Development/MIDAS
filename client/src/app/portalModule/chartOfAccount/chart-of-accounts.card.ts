import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { AccountLedger } from "../../shared/dataModels/financialModels/account-ledger.model";
import { CommonService } from "../../shared/common.service";


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
          <th class="arrow" (click)="sortByAccount()">Account # <mat-icon>arrow_drop_down_circle</mat-icon></th>
          <th class="arrow" (click)="sortByName()">Name <mat-icon class="mat-icon">arrow_drop_down_circle</mat-icon></th>
          <th class="arrow" (click)="sortByCategory()">Category <mat-icon>arrow_drop_down_circle</mat-icon></th>
          <th class="">Subcategory</th>
          <th class="">Description</th>
          <th class=""  (click)="sortByDate()">Date Created <mat-icon>arrow_drop_down_circle</mat-icon></th>
          <th class="arrow" (click)="sortByBalance()">Balance <mat-icon>arrow_drop_down_circle</mat-icon></th>
          <th class="arrow"(click)="sortByNormalSide()">Normal <mat-icon>arrow_drop_down_circle</mat-icon></th>
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
          <td class="">{{account.description}}</td>
          <td class="">{{common.convertTimestamp(account.createdAt)}}</td>
          <td class="">
            {{account.currentBalance | currency}}
          </td>
          <td class="">
            {{account.normalSide}}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            <span [class]="account.isActive ?
              'balanced' :
              'unbalanced'">
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



    public common = inject(CommonService);

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

    sortByAccount(){
      this.accounts!.sort((a, b) => (a.accountNumber < b.accountNumber ? -1 : 1));
    }

    sortByName(){
      this.accounts!.sort((a, b) => (a.accountName < b.accountName ? -1 : 1));
    }

    sortByCategory(){
      this.accounts!.sort((a, b) => (a.category< b.category ? -1 : 1));
    }

    sortByDate(){
      this.accounts!.sort((a, b) => (a.createdAt< b.createdAt ? -1 : 1));
    }

    sortByBalance(){
      this.accounts!.sort((a, b) => (a.currentBalance! < b.currentBalance! ? -1 : 1));
    }

    sortByNormalSide(){
      this.accounts!.sort((a, b) => (a.normalSide < b.normalSide ? -1 : 1));
    }


}
