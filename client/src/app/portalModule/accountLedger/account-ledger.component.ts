import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { AccountLedgerFacade } from "./back-end/account-ledger.facade";
import { AccountLedger } from "../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'app-account-ledger',
    template: `
    <ng-container *ngIf="loading">
      <div class="round-container">
        <mat-spinner diameter="48"></mat-spinner>
        <span class="ml-4 text-gray-600">Loading account ledger...</span>
      </div>
    </ng-container>

    <ng-container *ngIf="!loading && accountLedger">
      <account-ledger-card [accountLedger]="accountLedger" />
    </ng-container>
    `,
    styleUrl:'./account-ledger.component.scss',
})
export class AccountLedgerComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private destroySubject = new Subject<void>();

    loading = true;
    accountLedger: AccountLedger | null = null;

    constructor(private accountLedgerFacade: AccountLedgerFacade) {}

    ngOnInit() {
      this.route.params
        .pipe(takeUntil(this.destroySubject))
        .subscribe(params => {
          const accountNumber = params['accountNumber'];
          this.loading = true;

          this.accountLedgerFacade.getAccountLedger(accountNumber)
            .pipe(takeUntil(this.destroySubject))
            .subscribe({
              next: (ledger) => {
                this.accountLedger = ledger;
                this.loading = false;
              },
              error: (error) => {
                console.error('Failed to load account ledger:', error);
                this.loading = false;
              }
            });
        });
    }

    ngOnDestroy() {
      this.destroySubject.next();
      this.destroySubject.complete();
    }
}
