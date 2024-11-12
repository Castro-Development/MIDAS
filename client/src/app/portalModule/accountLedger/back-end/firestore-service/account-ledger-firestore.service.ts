import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountLedger } from '../../../../shared/dataModels/financialModels/account-ledger.model';

@Injectable({
    providedIn: 'root'
})
export class AccountLedgerFirestoreService {
    
    constructor(

    ) {

    }

    getAccountLedger(accountId: string): Observable<AccountLedger> {
        throw new Error("Method not implemented.");
      }

}