import { Component, OnInit, inject } from '@angular/core';
import { ChartOfAccountsCard } from './chart-of-accounts.card';
import { AccountLedger } from '../../shared/dataModels/financialModels/account-ledger.model';
import { AccountFilter } from '../../shared/dataModels/financialModels/account-ledger.model';
import { BehaviorSubject, Subject, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ChartOfAccountsFacade } from './back-end/chart-of-accounts.facade';


@Component({
  selector: 'app-chart-of-accounts',
  template: `
    <div class="main-container">

        <!-- Header Section -->
        <div class="title-header">
          <h2 class="section-header-global">Chart of Accounts</h2>

        </div>
        <div class="header">
          <button class="button return" routerLink="/portal-dashboard"><mat-icon class="mat-icon">arrow_back</mat-icon> Return to Accounting Dashboard</button>
          <div class="flex gap-4"> <!-- Added container for buttons -->
            <button
              (click)="manageFiscalPeriod()"
              class="gold-button"
            >
              <span class="material-icons mr-2">date_range</span>
              Fiscal Period
            </button>
            <button
              (click)="createNewAccount()"
              class="slate-button"
            >
              <span class="material-icons mr-2">add</span>
              Create New Account
            </button>
          </div>
        </div>



        <!-- Main Content -->
        <div class="">
          <chart-of-accounts-card
            [accounts]="accounts$ | async"
            (selectedAccount)="selectedAccount($event)"
          />
        </div>

    </div>
  `,
    styleUrl: './chart-of-accounts.scss',
})
export class ChartOfAccountsComponent {

  //Import chart of account service to receive information

  //Create subjects to hold the most up to date information from chart of account service
  accountFacade = inject(ChartOfAccountsFacade);

  accounts$ = this.accountFacade.getAllAccountsWhere(null);

  filter$ = this.accountFacade.getFilter();

  router = inject(Router);

  constructor(
  ) {
  }




  selectedAccount(account: AccountLedger) {
    // this.accountSelected.emit(account);
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
