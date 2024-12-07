export interface RecurringSubscriptionDetails{
    id: string;
    correspondingEntryId: string;
    description: string;
    frequency: string;
    startDate: Date;
    endDate: Date;
    requiresApproval: boolean;
    subscribers: string[];
}

export interface RecurringAdjustingEntry{
    id: string;
    subscriptionId: string;
    entryId: string;
}

export interface AdjustingEntry{
    id: string;
    type: AdjustingEntryType;
    description: string;
    requiresApproval: boolean
}

export enum AdjustingEntryType{
    ACCRUAL = 'ACCRUAL',
    DEFERRAL = 'DEFERRAL',
    ESTIMATE = 'ESTIMATE',
    REVERSAL = 'REVERSAL',
    AMORTIZATION = 'AMORTIZATION',
}

export interface PeriodEndAdjustingEntry{
    
}