import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, merge } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';
import { AccountLedger, AccountCategory, AccountFilter, AccountSubcategories, NormalSide } from '../../../shared/dataModels/financialModels/account-ledger.model';
import { ErrorHandlingService } from '../../../shared/errorHandling/error-handling.service';
import { AccountingStateService } from '../../../shared/account/accounting-state.service';
import { AuthStateService } from '../../../shared/user/auth/auth-state.service';
import { EventLogService } from '../../../shared/eventLog/event-log.service';
import { AccountCreationEvent, EventType } from '../../../shared/dataModels/loggingModels/event-logging.model';


type SubcategoryMap = {
  ASSET: 'CURRENT_ASSETS' | 'LONG_TERM_INVESTMENTS' | 'PROPERTY_PLANT_EQUIPMENT' | 'INTANGIBLE_ASSETS';
  LIABILITY: 'CURRENT_LIABILITIES' | 'LONG_TERM_LIABILITIES';
  EQUITY: 'OWNERS_EQUITY' | 'STOCKHOLDERS_EQUITY';
  REVENUE: 'OPERATING_REVENUE' | 'NON_OPERATING_REVENUE';
  EXPENSE: 'OPERATING_EXPENSE' | 'NON_OPERATING_EXPENSE';
};


// DTOs
export interface CreateAccountDTO {
  accountName: string;
  description: string;
  category: AccountCategory;
  subcategory: AccountSubcategories[AccountCategory];
  normalSide: NormalSide;
  createdBy: string;
  postRef: string;
}

export interface UpdateAccountDTO {
  accountName?: string;
  description?: string;
  category?: AccountCategory;
  subcategory?: string;
}

export interface AccountResponseDTO extends CreateAccountDTO {
  id: string;
  createdAt: Date;
  createdBy: string;
  status: 'active' | 'inactive';
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
  version: number;
}

enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}


interface AccountSearchResult {
  account: AccountResponseDTO;
  relevance: number;
  matchedFields: string[];
}


@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsFacade implements OnDestroy {
  // Cleanup subscription
  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountingStateService: AccountingStateService,
    private errorHandlingService: ErrorHandlingService,
    private authState: AuthStateService,
    private eventLog: EventLogService,
    private router: Router,
    // private accountingEventLog: AccountingEventLogService
  ) {}

  /**
   * Selects an account and navigates to its ledger view
   * @param accountId The ID of the account to select
   * @returns Observable<boolean> indicating success/failure
   */
  selectAccount(accountId: string): Observable<void> {
    return this.accountingStateService.selectAccount(accountId);
  }

  /**
   * Creates a new account in the chart of accounts
   * @param accountData The account creation data
   * @returns Observable<AccountResponseDTO>
   */
  createAccount(accountData: CreateAccountDTO): Observable<AccountResponseDTO> {
    
    const accountNumber = this.createAccountNumber(accountData.category, accountData.subcategory);
    
    const accountCreated = this.accountingStateService.createAccount(accountData, accountNumber, accountData.createdBy).pipe(
      tap((account: AccountLedger) => {
        this.eventLog.logEvent(EventType.ACCOUNT_CREATED, {
          type: EventType.ACCOUNT_CREATED,
          payload: null,
          accountId: account.accountNumber,
          userId: accountData.createdBy,
          dateCreated: new Date(),
          postRef: accountData.postRef,
        } as AccountCreationEvent);
      })
    );

    return accountCreated.pipe(
      map((account: AccountLedger) => {
        return  {
          id: account.accountNumber,
          createdAt: account.createdAt,
          createdBy: account.createdBy,
          status: account.isActive ? 'active' : 'inactive',
          version: account.version,
          accountName: account.accountName, 
          description: account.description, 
          category: account.category, 
          subcategory: account.subcategory, 
          normalSide: account.normalSide,
          postRef: accountData.postRef
        }
      })
    )
  }

  getAllAccountsWhere(filter: AccountFilter | null): Observable<AccountLedger[]> {
    return this.accountingStateService.filteredAccounts$;
  }

  /**
   * Updates an existing account
   * @param accountId The ID of the account to update
   * @param updates The account updates to apply
   * @returns Observable<AccountResponseDTO>
   */
  // updateAccount(accountId: string, updates: UpdateAccountDTO): Observable<AccountResponseDTO> {
  //   return this.accountingStateService.updateAccount(accountId, updates).pipe(
  //     tap(account => {
  //       this.eventBus.emit({
  //         type: 'ACCOUNT_UPDATED',
  //         payload: account
  //       });
  //       this.accountingEventLog.logEvent({
  //         type: 'ACCOUNT_UPDATE',
  //         accountId: account.id,
  //         userId: this.authState.getCurrentUserId(),
  //         timestamp: new Date(),
  //         details: {
  //           before: account,
  //           after: { ...account, ...updates }
  //         }
  //       });
  //     })
  //   );
  // }

  /**
   * Deactivates an account if it has no balance
   * @param accountId The ID of the account to deactivate
   * @returns Observable<boolean>
   */
  // deactivateAccount(accountId: string): Observable<boolean> {
  //   return this.accountingStateService.getAccount(accountId).pipe(
  //     map(account => {
  //       if (!account) {
  //         this.errorHandlingService.handleSystemError(
  //           'ACCOUNT_NOT_FOUND',
  //           'Account not found'
  //         );
  //         return false;
  //       }
        
  //       if (account.balance !== 0) {
  //         this.errorHandlingService.handleBusinessValidation(
  //           'ACCOUNT_HAS_BALANCE',
  //           'Cannot deactivate account with non-zero balance'
  //         );
  //         return false;
  //       }

  //       this.accountingStateService.deactivate(accountId);
  //       this.eventBus.emit({
  //         type: EventType.ACCOUNT_DEACTIVATED,
  //         payload: { accountId }
  //       });
  //       this.accountingEventLog.logEvent({
  //         type: 'ACCOUNT_DEACTIVATION',
  //         accountId: accountId,
  //         userId: this.authState.getUid$,
  //         timestamp: new Date(),
  //         details: account
  //       });
  //       return true;
  //     })
  //   );
  // }

  /**
   * Validates an account number according to business rules
   * @param accountNumber The account number to validate
   * @returns boolean indicating if the account number is valid
   */
  private createAccountNumber(
    accountCategory: AccountCategory,
    subcategory: AccountSubcategories[AccountCategory],
    parentAccount?: string
  ): Observable<string> {
    // Step 1: Get category prefix
    const categoryPrefix = this.getCategoryPrefix(accountCategory);
    
    // Step 2: Get subcategory number
    const subcategoryNumber = this.getSubcategoryNumber(accountCategory, subcategory);
    
    // Step 3: Handle parent/child relationship
    if (parentAccount) {
      // If this is a sub-account, use parent's number as base
      return this.generateNextChildNumber(parentAccount);
    } else {
      // If this is a new major account, generate next available
      const baseNumber = `${categoryPrefix}${subcategoryNumber}00`;
      return this.generateNextAvailableNumber(baseNumber);
    }
  }
  
  private getCategoryPrefix(category: AccountCategory): string {
    const prefixMap: Record<AccountCategory, string> = {
      'ASSET': '1',
      'LIABILITY': '2',
      'EQUITY': '3',
      'REVENUE': '4',
      'EXPENSE': '5'
    };
    return prefixMap[category];
  }
  
  private getSubcategoryNumber(
    category: AccountCategory, 
    subcategory: AccountSubcategories[AccountCategory]
  ): string {
    const subcategoryIndex = subcategory.toString() as keyof SubcategoryMap;
    const subcategoryMap: Record<AccountCategory, Record<string, string>> = {
      'ASSET': {
        'CURRENT_ASSETS': '1',
        'LONG_TERM_INVESTMENTS': '2',
        'PROPERTY_PLANT_EQUIPMENT': '3',
        'INTANGIBLE_ASSETS': '4'
      },
      'LIABILITY': {
        'CURRENT_LIABILITIES': '1',
        'LONG_TERM_LIABILITIES': '2'
      },
      'EQUITY': {
        'OWNERS_EQUITY': '1',
        'STOCKHOLDERS_EQUITY': '2'
      },
      'REVENUE': {
        'OPERATING_REVENUE': '1',
        'NON_OPERATING_REVENUE': '2'
      },
      'EXPENSE': {
        'OPERATING_EXPENSE': '1',
        'NON_OPERATING_EXPENSE': '2'
      }
    };
    return subcategoryMap[category][subcategoryIndex];
  }
  
  private generateNextAvailableNumber(baseNumber: string): Observable<string> {
    return this.accountingStateService.getAccountsStartingWith(baseNumber).pipe(
      map(accounts => {
        if (accounts.length === 0) return baseNumber;
        
        // Find highest number and increment
        const maxNumber = Math.max(...accounts.map(a => 
          parseInt(a.accountNumber.slice(-2))));
        const nextNumber = (maxNumber + 1).toString().padStart(2, '0');
        return baseNumber.slice(0, -2) + nextNumber;
      })
    );
  }
  
  private generateNextChildNumber(parentNumber: string): Observable<string> {
    return this.accountingStateService.getAccountsStartingWith(parentNumber).pipe(
      map(accounts => {
        if (accounts.length === 0) return parentNumber + '01';
        
        // Find highest child number and increment
        const maxNumber = Math.max(...accounts.map(a => 
          parseInt(a.accountNumber.slice(-2))));
        return parentNumber + (maxNumber + 1).toString().padStart(2, '0');
      })
    );
  }
  
  
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Note: Future consideration for mergeAccounts functionality
// Future enhancement could include account merging capability
// Would require:
// - Balance transfer logic
// - Reference updates
// - Historical record preservation
// - Special permissions


                                          //-------------------------------------------//
                                          /* * * * * Creation & Setup Methods * * * * */
                                          //------------------------------------------//

  // createAccount(accountData: CreateAccountDTO): Observable<AccountResponseDTO>
  // createChildAccount(parentId: string, accountData: CreateAccountDTO): Observable<AccountResponseDTO>
  // importAccounts(accounts: AccountImportDTO[]): Observable<ImportResult>
  // createAccountTemplate(templateData: AccountTemplateDTO): Observable<AccountTemplateDTO>

                                          //---------------------------------------------//
                                          /* * * * * Retrieval & Search Methods * * * * */
                                          //--------------------------------------------//

  // getAccount(id: string): Observable<AccountResponseDTO>
  // getAccounts(filter?: AccountFilter): Observable<AccountResponseDTO[]>
  // searchAccounts(query: string): Observable<AccountSearchResult[]>
  // getAccountHierarchy(): Observable<AccountHierarchyNode[]>
  // getAccountsByCategory(category: AccountCategory): Observable<AccountResponseDTO[]>
  // getInactiveAccounts(): Observable<AccountResponseDTO[]>
  // getRecentlyModifiedAccounts(days: number): Observable<AccountResponseDTO[]>

                                          //--------------------------------------------------//
                                          /* * * * * Updates & Modifications Methods * * * * */
                                          //-------------------------------------------------//

  // updateAccount(id: string, updates: UpdateAccountDTO): Observable<AccountResponseDTO>
  // updateAccountStatus(id: string, status: AccountStatus): Observable<void>
  // updateAccountHierarchy(changes: AccountHierarchyChange[]): Observable<void>
  // mergeAccounts(sourceId: string, targetId: string): Observable<AccountMergeResult>
  // splitAccount(accountId: string, splitConfig: AccountSplitConfig): Observable<AccountSplitResult>

                                          //------------------------------------------//
                                          /* * * * * Balance & Status Methods * * * * */
                                          //------------------------------------------//
  // reconcileAccount(id: string, reconciliationData: ReconciliationDTO): Observable<ReconciliationResult>
  // freezeAccount(id: string, reason: string): Observable<void>
  // unfreezeAccount(id: string): Observable<void>
  // closeAccount(id: string, closureData: AccountClosureDTO): Observable<void>
  // reopenAccount(id: string): Observable<void>

                                          //----------------------------------------------------//
                                          /* * * * * Validation & Verification Methods * * * * */
                                          //---------------------------------------------------//

  // validateAccountNumber(number: string): Observable<ValidationResult>
  // validateAccountStructure(accountData: CreateAccountDTO): Observable<ValidationResult>
  // verifyAccountBalance(id: string): Observable<BalanceVerificationResult>
  // checkAccountDependencies(id: string): Observable<AccountDependencyResult>

                                          //------------------------------------------//
                                          /* * * * * History & Audit Methods * * * * */
                                          //------------------------------------------//

    // getAccountHistory(id: string, options?: HistoryOptions): Observable<AccountHistoryEntry[]>
    // getAccountModificationLog(id: string): Observable<ModificationLogEntry[]>
    // getAccountBalanceHistory(id: string, dateRange: DateRange): Observable<BalanceHistoryEntry[]>
    // getAccountReconciliationHistory(id: string): Observable<ReconciliationHistoryEntry[]>

                                          //---------------------------------------------//
                                          /* * * * * Export & Reporting Methods * * * * */
                                          //--------------------------------------------//

  // exportAccounts(filter?: AccountFilter, format?: ExportFormat): Observable<ExportResult>
  // generateAccountReport(reportConfig: AccountReportConfig): Observable<AccountReport>
  // generateTrialBalance(options?: TrialBalanceOptions): Observable<TrialBalance>
  // generateAccountActivity(id: string, dateRange: DateRange): Observable<ActivityReport>

                                          //----------------------------------//
                                          /* * * * * Utility Methods * * * * */
                                          //----------------------------------//
  // validateAccountsChart(): Observable<ValidationResult>
  // generateNextAccountNumber(category: AccountCategory, parent?: string): Observable<string>
  // checkAccountNumberAvailability(number: string): Observable<boolean>
  // calculateAccountDepth(id: string): Observable<number>

                                          