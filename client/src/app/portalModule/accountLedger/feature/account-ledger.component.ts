import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subject, distinct, switchMap, takeUntil } from "rxjs";
import { AccountLedgerFacade } from "../back-end/facade/account-ledger.facade";


@Component({
    selector: 'app-account-ledger',
    template: `
    <account-ledger-card [account]="ledger$ | async" />
    `,
})
export class AccountLedgerComponent implements OnInit {

    accountNumberSubject = new BehaviorSubject<string>('');
    destroySubject = new Subject<void>();
    accountNumber$ = this.accountNumberSubject.asObservable();



    ledger$ = this.accountNumber$.pipe(
      switchMap(accountNumber => this.accountLedgerFacade.getAccountLedger(accountNumber))
    )

    constructor(
      private route: ActivatedRoute,
      private accountLedgerFacade: AccountLedgerFacade
    ) {}


  
    ngOnInit() {
      // Get the account number from the route parameters
      this.route.params.pipe(
        switchMap(params => {
          const accountNumber = params['accountNumber'];
          return this.accountLedgerFacade.getAccountLedger(accountNumber);
        })
      ).subscribe(ledger => {
        // Handle the ledger data
        console.log(ledger);
      });
    }
  }