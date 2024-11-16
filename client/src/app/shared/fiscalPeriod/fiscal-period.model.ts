export enum FiscalPeriodType {
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR'
}

export enum FiscalPeriodStatus {
    PENDING = 'PENDING',    // Created but not yet active
    ACTIVE = 'ACTIVE',      // Current working period
    ADJUSTMENT = 'ADJUSTMENT', // Closed to regular entries, open for adjustments
    CLOSED = 'CLOSED',      // Fully closed, no more entries allowed
    ARCHIVED = 'ARCHIVED'   // Historical, read-only
}

    // Core Period Model
export interface FiscalPeriod {
    id: string;
    type: FiscalPeriodType;
    name: string;           // e.g., "FY2024-Q1", "January 2024"
    startDate: Date;
    endDate: Date;
    status: FiscalPeriodStatus;

    // Metadata
    createdAt: Date;
    createdBy: string;
    modifiedAt: Date;
    modifiedBy: string;

    // Closing information
    closingDate?: Date;
    closedBy?: string;
    adjustmentClosingDate?: Date;

    // Relationships
    parentPeriodId?: string;  // For quarters/months linking to year
    previousPeriodId?: string;
    nextPeriodId?: string;

    // Control flags
    allowsAdjustments: boolean;
    isLocked: boolean;

    // Validation state
    balancesValidated: boolean;
    lastValidationDate?: Date;
}