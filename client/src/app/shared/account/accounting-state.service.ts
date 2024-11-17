import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, distinctUntilChanged, shareReplay, Subject, takeUntil, tap, catchError, Observable, of, switchMap, from } from "rxjs";
import { AccountLedger, AccountFilter, NormalSide } from "../dataModels/financialModels/account-ledger.model";
import { ErrorHandlingService } from "../errorHandling/error-handling.service";
import { AccountFirestoreService } from "./account-firestore.service";
import { FilteringService } from "../filter/filter.service";
import { CreateAccountDTO } from "../../portalModule/chartOfAccount/back-end/chart-of-accounts.facade";

  
  @Injectable({ providedIn: 'root' })
  export class AccountingStateService {
    private readonly accountsSubject = new BehaviorSubject<AccountLedger[]>([]);
    private selectedAccountSubject = new Subject<string>();
    private filterSubject = new Subject<AccountFilter>();

    private readonly accounts$ = this.accountsSubject.asObservable();
    private readonly filter$ = this.filterSubject.asObservable();

    private destroySubject = new Subject<void>();
    private readonly destroy$ = this.destroySubject.asObservable();
    currentBalances$: any;
    

    constructor(
      private accountingFirestoreService: AccountFirestoreService,
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
  
    
      
    readonly selectedAccount$ = this.accounts$.pipe(
      switchMap(accounts => this.selectedAccountSubject.pipe(
        map(selectedAccountNumber => accounts.find(account => account.accountNumber === selectedAccountNumber))
      )),
      distinctUntilChanged(),
      shareReplay(1)
    );
    

    readonly filteredAccounts$ = combineLatest([this.accounts$, this.filterSubject]).pipe(
      map(([journalEntries, filter]) => this.filterService.filter(journalEntries, filter, [
        'id',
        'entryNumber',
        'dateStart',
        'dateEnd',
        'status',
        'createdBy'
      ])),
      distinctUntilChanged(),
    );

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
            isActive: true,
            version: 1,
            createdAt: new Date(Date.now()),
            createdBy: userId,
            updatedAt: new Date(Date.now()),
            updatedBy: [userId],
            versionHistory: [],
            authorizedUsers: [userId],
          };
          
          // Convert Promise to Observable
          return from(this.accountingFirestoreService.createAccount(newAccount));
        })
      );
    }

  }
