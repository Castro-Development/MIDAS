
import { Component, inject } from "@angular/core";
import { AdjustingEntriesFacade } from "../adjusting-entries.facade";
import { tap } from "rxjs";


@Component({
    selector: 'fiscal-period-management',
    template: `
      <!-- Main Container - styled like a temple portico -->
      <div class="main-container bg-slate-900 min-h-screen">
        <!-- Header Section - echoing an entablature -->
        <header class="border-b border-amber-700/30 p-6 mb-8">
          <h1 class="text-2xl font-bold text-amber-100">Fiscal Period Management</h1>
        </header>

        <!-- Primary Navigation - like temple columns -->
        <nav class="grid grid-cols-3 gap-6 p-6 border-b border-amber-700/30">
          <div
            *ngFor="let section of ['Configuration', 'Active Periods', 'Period Close']"
            class="flex flex-col items-center p-6 bg-slate-800 rounded-lg
                   border border-amber-700/20 hover:border-amber-600/40
                   transition-all duration-300">
            <h2 class="text-amber-100 text-lg mb-2">{{section}}</h2>
          </div>
        </nav>

        <!-- Main Content Area - temple cella -->
        <div class="p-6">
          <!-- Configuration Panel -->
          <div *ngIf="showConfiguration"
               class="bg-slate-800 rounded-lg p-6 border border-amber-700/20">
            <h3 class="text-amber-100 text-xl mb-6">Fiscal Configuration</h3>

            <!-- Period Structure Configuration -->
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="space-y-4">
                <label class="block text-amber-100">Fiscal Year Start</label>
                <select class="form-select bg-slate-700 border-amber-700/30 text-amber-100">
                  <option>January</option>
                  <!-- Other months -->
                </select>
              </div>

              <div class="space-y-4">
                <label class="block text-amber-100">Primary Period Type</label>
                <select class="form-select bg-slate-700 border-amber-700/30 text-amber-100">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>

            <!-- Period Rules -->
            <div class="mb-8">
              <h4 class="text-amber-100 mb-4">Period Rules</h4>
              <div class="grid grid-cols-2 gap-4">
                <!-- Toggles styled like ancient switches -->
                <div class="flex items-center justify-between p-4
                            bg-slate-700 rounded border border-amber-700/20">
                  <span class="text-amber-100">Require Sequential Closing</span>
                  <!-- <toggle-switch [(ngModel)]="config.requireSequential"></toggle-switch> -->
                </div>
                <!-- Additional rules -->
              </div>
            </div>

            <!-- Active Periods Display - like a Greek scroll -->
            <div class="overflow-hidden rounded-lg border border-amber-700/20">
              <table class="w-full">
                <thead class="bg-slate-700">
                  <tr>
                    <th class="p-4 text-amber-100">Period</th>
                    <th class="p-4 text-amber-100">Start Date</th>
                    <th class="p-4 text-amber-100">End Date</th>
                    <th class="p-4 text-amber-100">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-slate-800">
                  <!-- Period rows -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `
  })
export class RecurringAdjustingEntryChartCard{



    adjustingEntryFacade = inject(AdjustingEntriesFacade);

    // config = this.adjustingEntryFacade.recurringAdjustingEntries$ = this.adjustingEntryFacade.getRecurringAdjustingEntries().pipe(
    //     tap((entries) => { console.log(entries); })
    // );
    constructor(){}
}
