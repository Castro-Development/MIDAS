
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PeriodStatus } from './fiscal-period.model';

@Component({
  selector: 'app-fiscal-period-management',
  template: `
    <div class="w-full h-full p-4">
  <!-- Header with View Toggles -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Fiscal Period Management</h1>
    <div class="flex gap-2">
      <button 
        (click)="setView('calendar')"
        [ngClass]="{
          'bg-blue-600 text-white': view === 'calendar',
          'bg-gray-100': view !== 'calendar'
        }"
        class="px-4 py-2 rounded"
      >
        Calendar View
      </button>
      <button 
        (click)="setView('list')"
        [ngClass]="{
          'bg-blue-600 text-white': view === 'list',
          'bg-gray-100': view !== 'list'
        }"
        class="px-4 py-2 rounded"
      >
        List View
      </button>
      <button 
        (click)="setView('timeline')"
        [ngClass]="{
          'bg-blue-600 text-white': view === 'timeline',
          'bg-gray-100': view !== 'timeline'
        }"
        class="px-4 py-2 rounded"
      >
        Timeline View
      </button>
    </div>
  </div>

  <!-- Calendar View -->
  <div *ngIf="view === 'calendar'" class="grid grid-cols-3 gap-6">
    <!-- Year Overview -->
    <div class="col-span-1 bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-medium mb-4">Fiscal Year 2024</h2>
      <div class="grid grid-cols-4 gap-2">
        <div 
          *ngFor="let month of months; let i = index"
          [ngClass]="{
            'bg-green-100 text-green-800': i < 3,
            'bg-blue-100 text-blue-800': i === 3,
            'bg-gray-100': i > 3
          }"
          class="p-2 text-center rounded cursor-pointer"
        >
          M{{i + 1}}
        </div>
      </div>
    </div>

    <!-- Current Period Details -->
    <div class="col-span-2 bg-white rounded-lg shadow p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">April 2024 (Current Period)</h2>
        <span 
          [ngClass]="{
            'bg-blue-100 text-blue-800': currentStatus === 'open',
            'bg-yellow-100 text-yellow-800': currentStatus === 'soft-close',
            'bg-purple-100 text-purple-800': currentStatus === 'adjustment',
            'bg-gray-100 text-gray-800': currentStatus === 'closed'
          }" 
          class="px-3 py-1 rounded-full text-sm"
        >
          {{getStatusDisplay(currentStatus)}}
        </span>
      </div>

      <!-- Status Timeline -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex-1" *ngFor="let status of periodStatuses">
          <div 
            [ngClass]="{
              'bg-blue-500': isStatusActive(status),
              'bg-gray-200': !isStatusActive(status)
            }" 
            class="h-2 rounded"
          ></div>
          <div class="mt-2 text-sm text-center">{{status}}</div>
        </div>
      </div>

      <!-- Period Actions -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Soft Close Button -->
        <button 
          class="p-3 border rounded transition-all duration-200"
          [ngClass]="{
            'hover:bg-gray-50': currentStatus === 'open',
            'bg-gray-100 cursor-not-allowed': currentStatus !== 'open'
          }"
          [disabled]="currentStatus !== 'open'"
          (click)="beginSoftClose()"
        >
          Begin Soft Close
        </button>

        <!-- Adjustment Phase Button -->
        <button 
          class="p-3 border rounded transition-all duration-200"
          [ngClass]="{
            'hover:bg-gray-50': currentStatus === 'soft-close',
            'bg-gray-100 cursor-not-allowed': currentStatus !== 'soft-close'
          }"
          [disabled]="currentStatus !== 'soft-close'"
          (click)="enterAdjustmentPhase()"
        >
          Enter Adjustment Phase
        </button>

        <!-- Close Period Button -->
        <button 
          class="p-3 border rounded transition-all duration-200"
          [ngClass]="{
            'hover:bg-gray-50': currentStatus === 'adjustment',
            'bg-gray-100 cursor-not-allowed': currentStatus !== 'adjustment'
          }"
          [disabled]="currentStatus !== 'adjustment'"
          (click)="closePeriod()"
        >
          Close Period
        </button>

        <!-- Adjusting Entry Button -->
        <button 
          *ngIf="currentStatus === 'adjustment'"
          class="p-3 border rounded bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200"
          (click)="createAdjustingEntry()"
        >
          Create Adjusting Entry
        </button>

        <!-- View Reports Button -->
        <button 
          *ngIf="currentStatus !== 'adjustment'"
          class="p-3 border rounded hover:bg-gray-50"
          (click)="viewReports()"
        >
          View Reports
        </button>
      </div>
    </div>
  </div>

  <!-- List View -->
  <div *ngIf="view === 'list'" class="bg-white rounded-lg shadow">
    <table class="w-full">
      <thead>
        <tr class="border-b">
          <th class="p-4 text-left">Period</th>
          <th class="p-4 text-left">Status</th>
          <th class="p-4 text-left">Date Range</th>
          <th class="p-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let period of periods; let i = index" class="border-b">
          <td class="p-4">
            {{i === 3 ? 'April 2024' : 'Month ' + (i + 1) + ', 2024'}}
          </td>
          <td class="p-4">
            <span 
              [ngClass]="{
                'bg-green-100 text-green-800': i < 3,
                'bg-blue-100 text-blue-800': i === 3,
                'bg-gray-100': i > 3
              }" 
              class="px-3 py-1 rounded-full text-sm"
            >
              {{i < 3 ? 'Closed' : i === 3 ? 'Active' : 'Future'}}
            </span>
          </td>
          <td class="p-4">
            01/0{{i + 1}}/2024 - 31/0{{i + 1}}/2024
          </td>
          <td class="p-4">
            <button class="text-blue-600 hover:text-blue-800">
              Manage
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Timeline View -->
  <div *ngIf="view === 'timeline'" class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center space-x-4 mb-8">
      <button class="p-2 rounded hover:bg-gray-100">
        <i class="material-icons">chevron_left</i>
      </button>
      <h3 class="text-lg font-medium">Q2 2024</h3>
      <button class="p-2 rounded hover:bg-gray-100">
        <i class="material-icons">chevron_right</i>
      </button>
    </div>

    <div class="relative">
      <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
      <div 
        *ngFor="let period of timelinePeriods; let i = index" 
        class="relative ml-8 mb-8 pb-8 border-b"
      >
        <div class="absolute -left-8 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medium">Month {{i + 4}}, 2024</h4>
            <p class="text-sm text-gray-500 mt-1">
              01/0{{i + 4}}/2024 - 30/0{{i + 4}}/2024
            </p>
          </div>
          <span 
            [ngClass]="{
              'bg-blue-100 text-blue-800': i === 0,
              'bg-gray-100': i !== 0
            }" 
            class="px-3 py-1 rounded-full text-sm"
          >
            {{i === 0 ? 'Active' : 'Future'}}
          </span>
        </div>
        <div *ngIf="i === 0" class="mt-4 flex items-center text-sm text-yellow-600">
          <i class="material-icons text-base mr-2">error</i>
          5 days until soft close
        </div>
      </div>
    </div>
  </div>
</div>
  `,
})
export class FiscalPeriodManagementComponent {
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
  
