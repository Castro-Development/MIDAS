import { Component, OnInit, inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChartOfAccountsFacade } from './back-end/chart-of-accounts.facade';
import { AccountLedger, AccountFilter } from '../../shared/dataModels/financialModels/account-ledger.model';

@Component({
  selector: 'app-chart-of-accounts',
  template: `
    <div class="main-container">
      <!-- Header Section -->
      <div class="title-header">
        <h2 class="section-header-global">Chart of Accounts</h2>
      </div>
      
      <div class="header">
        <button class="button return" routerLink="/portal-dashboard">
          <mat-icon class="mat-icon">arrow_back</mat-icon> Return to Accounting Dashboard
        </button>
        <div class="flex gap-4">
          <button (click)="manageFiscalPeriod()" class="gold-button">
            <span class="material-icons mr-2">date_range</span>
            Fiscal Period
          </button>
          <button (click)="createNewAccount()" class="slate-button">
            <span class="material-icons mr-2">add</span>
            Create New Account
          </button>
        </div>
      </div>

      <div class="filter-container">
        <div class="flex gap-2">
          <button mat-stroked-button (click)="showFilterCard()">
            <mat-icon>filter_list</mat-icon>
            Filters
          </button>
          <button mat-stroked-button (click)="false">
            <mat-icon>download</mat-icon>
            Export
          </button>
        </div>
      </div>

      <div *ngIf="showFilter">
        <filter-card
          [currentFilter]="currentFilter"
          (applyFilter)="applyFilter($event)"
        ></filter-card>
      </div>

      <!-- Main Content -->
      <div class="" *ngIf="!showFilter">
        <chart-of-accounts-card
          [accounts]="filteredAccounts$ | async"
          (selectedAccount)="selectedAccount($event)"
        />
      </div>
    </div>
  `,
  styleUrl: './chart-of-accounts.scss',
})
export class ChartOfAccountsComponent {
  accountFacade = inject(ChartOfAccountsFacade);
  router = inject(Router);

  private filterSubject = new BehaviorSubject<AccountFilter | null>(null);
  currentFilter: AccountFilter | undefined = undefined;

  private accounts$ = this.accountFacade.getAllAccountsWhere(null);
  
  filteredAccounts$ = combineLatest([
    this.accounts$,
    this.filterSubject
  ]).pipe(
    map(([accounts, filter]) => {
      if (!filter) return accounts;
      
      return accounts.filter(account => {
        const categoryMatch = !filter.category || account.category === filter.category;
        const searchMatch = !filter.searchTerm || 
          account.accountName.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
          account.accountNumber.toString().includes(filter.searchTerm);
        
        return categoryMatch && searchMatch;
      });
    })
  );

  showFilter = false;

  showFilterCard() {
    this.showFilter = !this.showFilter;
  }

  applyFilter(filter: AccountFilter) {
    this.currentFilter = filter;
    this.filterSubject.next(filter);
    this.showFilter = false;
  }

  selectedAccount(account: AccountLedger) {
    this.accountFacade.selectAccount(account.accountNumber);
    this.router.navigate(['/account-ledger', account.accountNumber]);
  }

  manageFiscalPeriod() {
    this.router.navigate(['/fiscal-period']);
  }

  createNewAccount() {
    this.router.navigate(['/add-account']);
  }
}