import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";


// First, create a separate component for the filter dialog
@Component({
    selector: 'filter-card',
    template: `
      <!-- <h2 mat-dialog-title>Filters</h2>
      <mat-dialog-content>
        <div class="space-y-4">
          <mat-form-field class="w-full">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="data.categoryFilter">
              <mat-option value="">All Categories</mat-option>
              <mat-option *ngFor="let category of data.categories" [value]="category">
                {{category}}
              </mat-option>
            </mat-select>
          </mat-form-field>
  
          <mat-form-field class="w-full">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="data.searchTerm" placeholder="Search accounts...">
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="clearFilters()">Clear</button>
        <button mat-button [mat-dialog-close]="data">Apply</button>
      </mat-dialog-actions> -->
    `
  })
  export class FilterDialogComponent {
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: {
        categoryFilter: string;
        searchTerm: string;
        categories: string[];
      }
    ) {}
  
    clearFilters() {
      this.data.categoryFilter = '';
      this.data.searchTerm = '';
    }
  }