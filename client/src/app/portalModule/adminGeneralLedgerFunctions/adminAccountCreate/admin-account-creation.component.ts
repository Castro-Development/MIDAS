import { Component, inject } from "@angular/core";
import { AccountFirestoreService } from "../../chartOfAccount/back-end/account-firestore.service";
import { AccountLedger } from "../../../shared/dataModels/financialModels/account-ledger.model";

@Component({
    selector: 'app-account-creation',
    template: `
    <account-creation-card
        (accountCreated)="handleAccountCreation($event)"

    ></account-creation-card>
    `,
})
export class AccountCreationComponent{
    accountFirestoreService = inject(AccountFirestoreService)

    handleAccountCreation(newAccount: AccountLedger) {
        console.log(newAccount);
        this.accountFirestoreService.createAccount(newAccount);
    }

}
