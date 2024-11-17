import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, combineLatest, map, distinctUntilChanged, shareReplay, Subject, takeUntil, tap, catchError, Observable, of, switchMap, from } from "rxjs";
import { AccountLedger, AccountFilter, NormalSide } from "../../../../shared/dataModels/financialModels/account-ledger.model";
import { ErrorHandlingService } from "../../../../shared/services/error-handling.service";
import { AccountFirestoreService } from "../firestore/account-firestore.service";
import { FilteringService } from "../../../../shared/services/filter.service";
import { AccountResponseDTO, CreateAccountDTO } from "../facade/chart-of-accounts.facade";
import { serverTimestamp } from "firebase/firestore";
import { timeStamp } from "console";

  
  @Injectable({ providedIn: 'root' })
  export class AccountingStateService {
    private readonly accountsSubject = new BehaviorSubject<AccountLedger[]>([]);
    private selectedAccountSubject = new Subject<string>();
    private filterSubject = new Subject<AccountFilter>();

    private readonly accounts$ = this.accountsSubject.asObservable();
    private readonly filter$ = this.filterSubject.asObservable();

    private destroySubject = new Subject<void>();
    private readonly destroy$ = this.destroySubject.asObservable();
    

    accountingFirestoreService = inject(AccountFirestoreService);
    

    constructor(
      private errorHandlingService: ErrorHandlingService,
      private filterService: FilteringService

    ) {
      this.initializeAccountingState();
    }

    initializeAccountingState() {
      this.accountingFirestoreService.getAllAccounts().pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          return this.errorHandlingService.handleError(error, [] as AccountLedger[]);
        }),
        tap(accounts => this.accountsSubject.next(accounts)),
        
      );
    }
  
    
      
    readonly selectedAccount$ = this.selectedAccountSubject.pipe(
      catchError(error => {return this.errorHandlingService.handleError(error, [] as AccountLedger[])}),
      distinctUntilChanged()
    );

    readonly filteredAccounts$ = this.accountingFirestoreService.getAllAccounts().pipe(

    )

    updateFilters(filter: AccountFilter) {
      this.filterSubject.next(filter);
    }

    selectAccount(accountId: string): Observable<void>{
      return of(this.selectedAccountSubject.next(accountId));

    }

    getAccountsStartingWith(basenum: string): Observable<AccountLedger[]> {
      return this.accounts$.pipe(
        map(accounts => accounts.filter(account => account.accountNumber.startsWith(basenum))),
        distinctUntilChanged()
      );
    }
    
    createAccount(
      account: CreateAccountDTO, 
      accNum: Observable<string>, 
      userId: string
    ): Observable<AccountLedger> {
      return combineLatest([accNum, userId]).pipe(
        switchMap(([accNum, userId]) => {
          const newAccount: AccountLedger = {
            accountName: account.accountName,
            description: account.description,
            category: account.category,
            subcategory: account.subcategory,
            normalSide: account.normalSide,
            accountNumber: accNum,
            isActive: false,
            version: 1,
            createdAt: new Date(Date.now()),
            createdBy: userId,
            updatedAt: new Date(Date.now()),
            updatedBy: [userId],
            versionHistory: [],
            authorizedUsers: [userId],
          };
          
          // Convert Promise to Observable
          return this.accountingFirestoreService.createAccount(newAccount).then(() => {
            return newAccount;
          })
        })
      );
    }

    deactivateAccount(accountId: string): Promise<void> {
      return this.accountingFirestoreService.deactivateAccount(accountId);
    }
  }

    //Possible method?
  // refreshBalances(): Observable<AccountBalance[]> {
  //   this.loadingSubject.next(true);

  //   return this.accountFirestore.getAllCurrentBalances().pipe(
  //     tap(balances => {
  //       const balanceMap = new Map<string, number>();
  //       (balances as AccountBalance[]).forEach(b => balanceMap.set(b.accountId, b.balance));
  //       this.accountState.current.next(balanceMap);
  //     }),
  //     tap(() => this.loadingSubject.next(false))
  //   );
  // }