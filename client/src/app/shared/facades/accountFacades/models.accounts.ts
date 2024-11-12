export type BalanceStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'RECONCILED' | 'UNRECONCILED';



export interface BalanceDTO {
  accountId: string;
  currentBalance: number;
  availableBalance: number;
  pendingDebits: number;
  pendingCredits: number;
  lastUpdated: Date;
  status: BalanceStatus;
  reconciled: boolean;
  lastReconciled?: Date;
}
// export interface BalanceAdjustmentDTO {
//     amount: number;
//     type: AdjustmentType;
//     reason: string;
//     documentation?: string;
//     effectiveDate: Date;
//     referenceNumber?: string;
//   }
  
//   export interface PeriodBalanceDTO {
//     period: AccountingPeriod;
//     openingBalance: number;
//     closingBalance: number;
//     totalDebits: number;
//     totalCredits: number;
//     adjustments: BalanceAdjustmentDTO[];
//     status: PeriodStatus;
//   }
  
//   export interface ReconciliationSession {
//     id: string;
//     accountId: string;
//     startDate: Date;
//     endDate: Date;
//     startingBalance: number;
//     endingBalance: number;
//     items: ReconciliationItem[];
//     status: ReconciliationStatus;
//     adjustments: BalanceAdjustmentDTO[];
//   }
  
//   export interface ReconciliationItem {
//     transactionId: string;
//     date: Date;
//     description: string;
//     amount: number;
//     type: 'DEBIT' | 'CREDIT';
//     status: 'PENDING' | 'MATCHED' | 'UNMATCHED';
//     reference?: string;
//   }
  
//   export interface BalanceTrendAnalysis {
//     dailyTrend: TrendPoint[];
//     monthlyTrend: TrendPoint[];
//     seasonality?: SeasonalityAnalysis;
//     anomalies: BalanceAnomaly[];
//     statistics: BalanceStatistics;
//   }
  
//   export interface BalanceThreshold {
//     accountId: string;
//     type: ThresholdType;
//     value: number;
//     condition: ThresholdCondition;
//     notification: NotificationConfig;
//   }
  
  export type BalanceEvents = 
    | 'BALANCE_UPDATED'
    | 'BALANCE_ADJUSTED'
    | 'RECONCILIATION_COMPLETED'
    | 'PERIOD_CLOSED'
    | 'THRESHOLD_BREACHED'
    | 'ANOMALY_DETECTED'
    | 'BALANCE_VERIFIED'
    | 'ADJUSTMENT_REVERSED';