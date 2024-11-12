// ----------------
// Base Enums
// ----------------
export enum AccountCategory {
    ASSET = 'ASSET',
    LIABILITY = 'LIABILITY',
    EQUITY = 'EQUITY',
    REVENUE = 'REVENUE',
    EXPENSE = 'EXPENSE'
  }
  
export  enum NormalSide {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT'
  }
  
 export enum StatementType {
    BALANCE_SHEET = 'BS',
    INCOME_STATEMENT = 'IS',
    RETAINED_EARNINGS = 'RE',
    CASH_FLOW = 'CF'
  }
  
export  enum JournalEntryStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    POSTED = 'POSTED',
    REJECTED = 'REJECTED'
  }
  
  enum LedgerStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    ARCHIVED = 'ARCHIVED'
  }
  
  enum EventAction {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED',
    STATUS_CHANGED = 'STATUS_CHANGED',
    POSTED = 'POSTED',
    RECONCILED = 'RECONCILED',
    CLOSED = 'CLOSED'
  }
  
  // ----------------
  // Account Structure
  // ----------------
  export interface AccountSubcategories {
    ASSET: [
      'CURRENT_ASSETS',
      'LONG_TERM_INVESTMENTS',
      'PROPERTY_PLANT_EQUIPMENT',
      'INTANGIBLE_ASSETS'
    ],
    LIABILITY: [
      'CURRENT_LIABILITIES',
      'LONG_TERM_LIABILITIES'
    ],
    EQUITY: [
      'OWNERS_EQUITY',
      'STOCKHOLDERS_EQUITY'
    ],
    REVENUE: [
      'OPERATING_REVENUE',
      'NON_OPERATING_REVENUE'
    ],
    EXPENSE: [
      'OPERATING_EXPENSE',
      'NON_OPERATING_EXPENSE'
    ]
  }

  export interface AccountLedgerReference {
    journalEntryId: string;
    date: Date;
    postReference: string;
  }
  
  export interface AccountLedger {
    accountName: string;
    accountNumber: string;
    description: string;
    normalSide: NormalSide;
    category: AccountCategory;
    subcategory: AccountSubcategories[AccountCategory];
    
    // Balance tracking
    openingBalance?: number;
    currentBalance?: number;
    totalDebits?: number;
    totalCredits?: number;
    
    // All entries affecting this account
    entriesReference?: AccountLedgerReference[];
    
    // For ordering in statements
    order?: string;
    authorizedUsers: string[];
    
    // Status
    isActive: boolean;
    lastReconciled?: Date;
    reconciledBalance?: number;
    
    // Metadata & Version tracking
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string[];
    version: number;
    versionHistory: AccountVersionHistory[];
    documentId?: string;
  }

  
  
  export interface LedgerFilter {
    dateRange?: {
      start?: Date;
      end?: Date;
    };
    entryTypes?: ('DEBIT' | 'CREDIT')[];
    amountRange?: {
      min: number;
      max: number;
    };
    statusFilter?: EntryStatus[];
    documentTypes?: DocumentType[];
  }
  
  export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'FROZEN';
  export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  export type EntryStatus = 'POSTED' | 'PENDING' | 'REJECTED' | 'REVERSED';
  export type DocumentType = 'INVOICE' | 'RECEIPT' | 'CONTRACT' | 'OTHER';
  
  export interface DocumentReference {
    id: string;
    type: DocumentType;
    filename: string;
    uploadedAt: Date;
  }

  export interface AccountFilter {
    category?: AccountCategory;
    subcategory?: AccountSubcategories[AccountCategory];
    isActive?: boolean;
    normalSide?: NormalSide;
  }
  
  export interface AccountVersionHistory {
    id: string;
    accountId: string;
    version: number;
    changes: {
      field: keyof AccountLedger;
      oldValue: any;
      newValue: any;
    }[];
    timestamp: Date;
    modifiedBy: string;
  }
  
  // ----------------
  // Journal Entries
  // ----------------
  export interface JournalEntry {
    id: string;
    postReference: string;
    date: Date;
    description: string;
    status: JournalEntryStatus;
    
    // Double-entry transactions
    transactions: JournalTransaction[];
    accounts: string[];
    
    // Balancing
    totalDebits: number;
    totalCredits: number;
    isBalanced: boolean;
    
    // Metadata
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    postedAt?: Date;
    postedBy?: string;
    
    // Version tracking
    version: number;
    versionHistory: JournalEntryVersionHistory[];
  }

  export interface JournalFilter{
    id?: string;
    entryNumber?: string;
    dateStart?: Date;
    dateEnd?: Date;
    status: JournalEntryStatus;
    createdBy?: string;
  }
  
  export interface JournalTransaction {
    id: string;
    journalEntryId: string;
    accountId: string;
    description?: string;
    debitAmount: number;
    creditAmount: number;
    
    // For event tracking
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  }
  
  export interface JournalEntryVersionHistory {
    id: string;
    journalEntryId: string;
    version: number;
    changes: {
      field: keyof JournalEntry | 'transactions';
      oldValue: any;
      newValue: any;
    }[];
    timestamp: Date;
    modifiedBy: string;
  }
  
  // ----------------
  // General Ledger
  // ----------------
  export interface GeneralLedger {
    id: string;
    fiscalYear: number;
    periodStart: Date;
    periodEnd: Date;
    
    // Reference to accounts that had activity in this period
    accountIds: string[];
    
    // Metadata
    status: LedgerStatus;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    closedAt?: Date;
    closedBy?: string;
  }
  
  export interface LedgerEntry {
    journalEntryId: string;
    date: Date;
    description: string;
    debitAmount: number;
    creditAmount: number;
    runningBalance: number;
    
    // For audit trail
    postedAt?: Date;
    postedBy?: string;
  }
  
  
  // ----------------
  // Financial Statements
  // ----------------
  interface StatementAccountMapping {
    [StatementType.BALANCE_SHEET]: AccountCategory.ASSET | AccountCategory.LIABILITY | AccountCategory.EQUITY;
    [StatementType.INCOME_STATEMENT]: AccountCategory.REVENUE | AccountCategory.EXPENSE;
    [StatementType.RETAINED_EARNINGS]: AccountCategory.EQUITY;
  }
  
  interface FinancialStatement {
    id: string;
    type: StatementType;
    periodStart: Date;
    periodEnd: Date;
    createdAt: Date;
    createdBy: string;
    accounts: Array<{
      accountId: string;
      category: AccountCategory;
      balance: number;
      previousBalance?: number;
    }>;
    totals: {
      [key in AccountCategory]?: number;
    };
  }
  
  // ----------------
  // Event Logging
  // ----------------
  interface EventLog {
    id: string;
    timestamp: Date;
    entityType: 'ACCOUNT' | 'JOURNAL_ENTRY' | 'GENERAL_LEDGER';
    entityId: string;
    action: EventAction;
    userId: string;
    details: {
      version?: number;
      changes?: any;
      description?: string;
    };
    metadata: {
      ipAddress?: string;
      userAgent?: string;
    };
  }
  
  interface EventQuery {
    entityType?: 'ACCOUNT' | 'JOURNAL_ENTRY' | 'GENERAL_LEDGER';
    entityId?: string;
    action?: EventAction;
    userId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    version?: number;
  }
  
  // ----------------
  // Helper Types
  // ----------------
  interface StatementGenerationConfig {
    type: StatementType;
    periodStart: Date;
    periodEnd: Date;
    compareWithPreviousPeriod?: boolean;
    includedCategories?: AccountCategory[];
    includedSubcategories?: string[];
  }
  
  interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
  }
  
  interface ValidationError {
    code: string;
    message: string;
    field?: string;
  }