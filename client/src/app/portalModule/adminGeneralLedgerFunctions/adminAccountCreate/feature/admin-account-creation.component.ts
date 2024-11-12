import { Component, inject } from "@angular/core";
import { AccountFirestoreService } from "../../../../shared/services/firestoreService/account-firestore.service";
import { Account } from "../../../../shared/dataModels/financialModels/account-ledger.model";

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

    handleAccountCreation(newAccount: Account) {
        console.log(newAccount);
        this.accountFirestoreService.createAccount(newAccount);
    }
    
}