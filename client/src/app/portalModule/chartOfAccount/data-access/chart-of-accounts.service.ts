// import { Injectable } from '@angular/core';
// import { AccountFirestoreService } from '../../../shared/services/firestoreService/account-firestore.service';
// import { Observable, Subject } from 'rxjs';
// import { Account, AccountFilter } from '../../../shared/dataModels/financialModels/account-ledger.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChartOfAccountsService {
  
//   constructor(private accountFirestoreService: AccountFirestoreService) { }

//   getAllAccountsWhere(filter?: AccountFilter | null): Observable<Account[] | null> {
//     if(!filter) { return this.accountFirestoreService.getAllAccountsWhere(); }
//     return this.accountFirestoreService.getAllAccountsWhere(filter);
//   }

//   getAccountById(id: string) {
//     return this.accountFirestoreService.getAccountById(id);
//   }



// }
