import { Component, OnInit, inject } from '@angular/core';
import { ChartOfAccountsCard } from '../ui/chart-of-accounts.card';
import { Account } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { AccountFilter } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { Router } from '@angular/router';
import { ChartOfAccountsFacade } from '../../../shared/facades/accountFacades/chart-of-accounts.facade';


@Component({
  selector: 'app-chart-of-accounts',
  template: `
  <div style="width: 100vw; height: 90vh;">
  <chart-of-accounts-card
    style="width: 80%; height: 60%; background-color: light-gray;"
    [accounts]="accounts$ | async"
    (selectedAccount)="selectedAccount($event)"
  />
  <button style="width: 30px; height: 7px; color: red; border: 3px; background-color: white;" (click)="createNewAccount()">Create New Account</button>
  </div>
  `,
})
export class ChartOfAccountsComponent implements OnInit {

  //Import chart of account service to receive information

  //Create subjects to hold the most up to date information from chart of account service
  filterSubject = new BehaviorSubject<AccountFilter | null>(null);
  accountsSubject = new Subject<Account[] | null>();
  filter$ = this.filterSubject.asObservable();
  accounts$ = this.accountsSubject.asObservable();
  accountFacade = inject(ChartOfAccountsFacade);

  router = inject(Router);
  
  constructor(
    private chartOfAccountsFacade: ChartOfAccountsFacade
  ) {}

  ngOnInit(): void {
    //Subscribe to the chart of account service to get the most up to date information
    this.filter$.subscribe((filter: AccountFilter | null) => {
      console.log(filter);
      this.chartOfAccountsFacade.getAllAccountsWhere(filter).subscribe(accounts => {
        console.log(accounts);
        this.accountsSubject.next(accounts);
      })
    })
  }
  
  selectedAccount(account: Account) {
    // this.accountSelected.emit(account);
    this.accountFacade.selectAccount(account.accountNumber);
    this.router.navigate(['/admin/account', account.accountNumber]);
  }
  
  createNewAccount() {
    this.router.navigate(['/admin/create-account']);
  }
}
