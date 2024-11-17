import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AccountLedger } from "../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'account-ledger-card',
    template: `
    `,
})
export class AccountLedgerCard implements OnInit {
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