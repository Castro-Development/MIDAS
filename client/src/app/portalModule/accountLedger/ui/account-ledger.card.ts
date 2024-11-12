import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Account } from "../../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'account-ledger-card',
    template: `
    `,
})
export class AccountLedgerCard implements OnInit {
    @Input() accounts: Account[] | null = [];
    @Output() selectedAccount = new EventEmitter<Account>();
    @Output() editAccount = new EventEmitter<Account>();
    @Output() viewHistory = new EventEmitter<Account>();

    constructor() {}

    ngOnInit(): void {
        // Remove the throw error if you don't need special initialization
    }

    // Add these methods to handle the events
    handleEditAccount(account: Account): void {
        this.editAccount.emit(account);
    }

    handleViewHistory(account: Account): void {
        this.viewHistory.emit(account);
    }
}