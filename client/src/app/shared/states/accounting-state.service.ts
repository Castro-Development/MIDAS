import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, distinctUntilChanged, shareReplay, Subject, takeUntil, tap, catchError, Observable, of, switchMap, from } from "rxjs";
import { Account, AccountFilter, NormalSide } from "../dataModels/financialModels/account-ledger.model";
import { ErrorHandlingService } from "../services/error-handling.service";
import { EventBusService } from "../services/event-bus.service";
import { AccountFirestoreService } from "../services/firestoreService/account-firestore.service";
import { FilteringService } from "../services/filter.service";
import { AccountResponseDTO, CreateAccountDTO } from "../facades/accountFacades/chart-of-accounts.facade";
import { serverTimestamp } from "firebase/firestore";
import { timeStamp } from "console";

  
  @Injectable({ providedIn: 'root' })
  export class AccountingStateService {
    private readonly accountsSubject = new BehaviorSubject<Account[]>([]);
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
      private eventBus: EventBusService,
      private filterService: FilteringService

    ) {
      this.initializeAccountingState();
    }

    initializeAccountingState() {
      this.accountingFirestoreService.accounts$.pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          return this.errorHandlingService.handleError(error, [] as Account[]);
        }),
        tap(accounts => this.accountsSubject.next(accounts)),
        
      );
    }
  
    
      
    readonly selectedAccount$ = this.selectedAccountSubject.pipe(
      catchError(error => {return this.errorHandlingService.handleError(error, [] as Account[])}),
      distinctUntilChanged()
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

    getAccountsStartingWith(basenum: string): Observable<Account[]> {
      return this.accounts$.pipe(
        map(accounts => accounts.filter(account => account.accountNumber.startsWith(basenum))),
        distinctUntilChanged()
      );
    }
    
    createAccount(
      account: CreateAccountDTO, 
      accNum: Observable<string>, 
      userId: string
    ): Observable<Account> {
      return combineLatest([accNum, userId]).pipe(
        switchMap(([accNum, userId]) => {
          const newAccount: Account = {
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
          };
          
          // Convert Promise to Observable
          return from(this.accountingFirestoreService.createAccount(newAccount));
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