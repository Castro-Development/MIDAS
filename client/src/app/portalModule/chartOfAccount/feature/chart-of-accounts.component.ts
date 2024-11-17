import { Component, OnInit, inject } from '@angular/core';
import { ChartOfAccountsCard } from '../ui/chart-of-accounts.card';
import { AccountLedger } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { AccountFilter } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { BehaviorSubject, Subject, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ChartOfAccountsFacade } from '../back-end/facade/chart-of-accounts.facade';


@Component({
  selector: 'app-chart-of-accounts',
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-900">Chart of Accounts</h1>
          <button 
            (click)="createNewAccount()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors duration-200 flex items-center gap-2"
          >
            <span class="material-icons text-sm">add</span>
            Create New Account
          </button>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow">
          <chart-of-accounts-card
            [accounts]="accounts$ | async"
            (selectedAccount)="selectedAccount($event)"
          />
        </div>
      </div>
    </div>
  `
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
    this.router.navigate(['/portal/account-ledger', account.accountNumber]);
  }
  
  createNewAccount() {
    this.router.navigate(['/portal/general-ledger-functions/add-account']);
  }
}
