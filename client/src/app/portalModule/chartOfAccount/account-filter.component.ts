import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AccountCategory, AccountFilter } from "../../shared/dataModels/financialModels/account-ledger.model";

@Component({
  selector: 'filter-card',
  template: `
    <div class="filter-card p-4 bg-white rounded shadow">
      <h2 class="text-xl mb-4">Filters</h2>
      <div class="space-y-4">
        <mat-form-field class="w-full">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="filter.category">
            <mat-option [value]="null">All Categories</mat-option>
            <mat-option *ngFor="let category of categoryOptions | keyvalue" 
                       [value]="category.value">
              {{category.key}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="filter.searchTerm" 
                 placeholder="Search by account name or number">
          <button mat-icon-button matSuffix *ngIf="filter.searchTerm"
                  (click)="filter.searchTerm = ''">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button mat-button (click)="clearFilters()">Clear</button>
        <button mat-raised-button color="primary" 
                (click)="applyFilters()">Apply</button>
      </div>
    </div>
  `,
  styleUrl: './chart-of-accounts.scss'
})
export class FilterDialogComponent implements OnInit {
  @Input() currentFilter: AccountFilter | undefined = undefined;
  @Output() applyFilter = new EventEmitter<AccountFilter>();

  filter: AccountFilter = {
    category: undefined,
    searchTerm: ''
  };

  categoryOptions = {
    'Asset': AccountCategory.ASSET,
    'Liability': AccountCategory.LIABILITY,
    'Equity': AccountCategory.EQUITY,
    'Revenue': AccountCategory.REVENUE,
    'Expense': AccountCategory.EXPENSE
  };

  ngOnInit() {
    if (this.currentFilter) {
      this.filter = { ...this.currentFilter };
    }
  }

  clearFilters() {
    this.filter = {
      category: undefined,
      searchTerm: ''
    };
    this.applyFilter.emit(this.filter);
  }

  applyFilters() {
    this.applyFilter.emit(this.filter);
  }
}