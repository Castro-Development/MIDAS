export enum PeriodStatus {
    OPEN = 'open',
    SOFT_CLOSE = 'soft-close',
    ADJUSTMENT = 'adjustment',
    CLOSED = 'closed'
}
export enum PeriodType {
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly'
}

export interface FiscalPeriod {
    id: string;
    periodType: PeriodType;
    startDate: Date;
    endDate: Date;
    status: PeriodStatus;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AnnualFiscalPeriod{
    year: number;
    periods: FiscalPeriod[];
}

export interface QuarterlyFiscalPeriod{
    year: AnnualFiscalPeriod;
    quarter: number;
    periods: FiscalPeriod[];
}

export interface MonthlyFiscalPeriod{
    year: AnnualFiscalPeriod;
    quarter: QuarterlyFiscalPeriod;
    month: number;
}