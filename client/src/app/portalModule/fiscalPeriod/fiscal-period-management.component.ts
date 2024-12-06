
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PeriodStatus } from './fiscal-period.model';
import { AccountLedger } from '../../shared/dataModels/financialModels/account-ledger.model';
import { ChartOfAccountsFacade } from '../chartOfAccount/back-end/chart-of-accounts.facade';

@Component({
  selector: 'app-fiscal-period-management',
  templateUrl: './fiscal-period-management.component.html',
  styleUrl: './fiscal-period-management.component.scss',
})
export class FiscalPeriodManagementComponent {

  @Input() accounts: AccountLedger[] | null = [];
  accountFacade = inject(ChartOfAccountsFacade);
  accounts$ = this.accountFacade.getAllAccountsWhere(null);
  filter$ = this.accountFacade.getFilter();

  //router = inject(Router);


    view: 'calendar' | 'list' | 'timeline' = 'calendar';
    currentStatus: PeriodStatus = PeriodStatus.OPEN;
    timelinePeriods = Array.from({ length: 4 });
    months = Array.from({ length: 12 });
    periods = Array.from({ length: 4 });
    periodStatuses = [
        PeriodStatus.OPEN,
        PeriodStatus.SOFT_CLOSE,
        PeriodStatus.ADJUSTMENT,
        PeriodStatus.CLOSED
    ];

    constructor(private router: Router) {}

    isStatusActive(status: PeriodStatus): boolean {
      const statusOrder = ['open', 'soft-close', 'adjustment', 'closed'];
      const currentIndex = statusOrder.indexOf(this.currentStatus);
      const statusIndex = statusOrder.indexOf(status);
      return statusIndex <= currentIndex;
    }

    getStatusDisplay(status: PeriodStatus): string {
      const displayMap = {
        'open': 'Active',
        'soft-close': 'Soft Closed',
        'adjustment': 'Adjustments',
        'closed': 'Closed'
      };
      return displayMap[status];
    }

    beginSoftClose(): void {
      if (this.currentStatus === PeriodStatus.OPEN) {
        this.currentStatus = PeriodStatus.SOFT_CLOSE;
        // Here you would typically call a service to update the period status
      }
    }

    enterAdjustmentPhase(): void {
      if (this.currentStatus === 'soft-close') {
        this.currentStatus = PeriodStatus.ADJUSTMENT;
        // Here you would typically call a service to update the period status
      }
    }

    closePeriod(): void {
      if (this.currentStatus === 'adjustment') {
        this.currentStatus = PeriodStatus.CLOSED;
        // Here you would typically call a service to update the period status
      }
    }

    createAdjustingEntry(): void {
      // Navigate to the adjusting entry form
      this.router.navigate(['/portal/journal-entry-form'], {
        queryParams: { type: 'adjusting' }
      });
    }

    viewReports(): void {
      // Navigate to reports view
      this.router.navigate(['/portal/reports']);
    }

    setView(view: 'calendar' | 'list' | 'timeline'): void {
      this.view = view;
    }
  }

