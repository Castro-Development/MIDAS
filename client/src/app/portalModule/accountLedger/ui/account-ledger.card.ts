import { Component, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { AccountLedger, LedgerEntry } from "../../../shared/dataModels/financialModels/account-ledger.model";
import { JournalEntryFacade } from "../../journalEntry/journal-entries.facade";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { Observable, map, of } from "rxjs";

@Component({
    selector: 'account-ledger-card',
    template: `
    <!-- Header Section -->
    <div class="p-6 bg-white">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Account Ledger</h1>
          <p class="text-gray-600">Account #1001 - Cash</p>
        </div>
        
        <div class="flex gap-2">
          <button mat-stroked-button (click)="openFilters()">
            <mat-icon>filter_list</mat-icon>
            Filters
          </button>
          <button mat-stroked-button (click)="exportData()">
            <mat-icon>download</mat-icon>
            Export
          </button>
        </div>
      </div>

      <!-- Balance Cards -->
      <mat-card class="mb-6">
        <mat-card-content>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-600">Opening Balance</p>
              <p class="text-lg font-semibold">{{openingBalance | currency}}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Current Balance</p>
              <p class="text-lg font-semibold">{{currentBalance | currency}}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Pending Transactions</p>
              <p class="text-lg font-semibold text-blue-600">{{pendingCount}}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Transactions Table -->
      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="w-full">
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef> Date </th>
              <td mat-cell *matCellDef="let entry"> {{entry.date | date:'shortDate'}} </td>
            </ng-container>

            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef> Description </th>
              <td mat-cell *matCellDef="let entry"> {{entry.description}} </td>
            </ng-container>

            <!-- Debit Column -->
            <ng-container matColumnDef="debit">
              <th mat-header-cell *matHeaderCellDef class="text-right"> Debit </th>
              <td mat-cell *matCellDef="let entry" class="text-right"> 
                {{entry.debit | currency:'USD':'symbol':'1.2-2'}} 
              </td>
            </ng-container>

            <!-- Credit Column -->
            <ng-container matColumnDef="credit">
              <th mat-header-cell *matHeaderCellDef class="text-right"> Credit </th>
              <td mat-cell *matCellDef="let entry" class="text-right"> 
                {{entry.credit | currency:'USD':'symbol':'1.2-2'}} 
              </td>
            </ng-container>

            <!-- Balance Column -->
            <ng-container matColumnDef="balance">
              <th mat-header-cell *matHeaderCellDef class="text-right"> Balance </th>
              <td mat-cell *matCellDef="let entry" class="text-right font-medium"> 
                {{entry.balance | currency:'USD':'symbol':'1.2-2'}} 
              </td>
            </ng-container>

            <!-- Post Reference Column -->
            <ng-container matColumnDef="postReference">
              <th mat-header-cell *matHeaderCellDef class="text-center"> PR </th>
              <td mat-cell *matCellDef="let entry" class="text-center">
                <button mat-button color="primary" (click)="viewJournalEntry(entry.postReference)">
                  {{entry.postReference}}
                </button>
              </td>
            </ng-container>

            <!-- Documents Column -->
            <ng-container matColumnDef="documents">
              <th mat-header-cell *matHeaderCellDef class="text-center"> Docs </th>
              <td mat-cell *matCellDef="let entry" class="text-center">
                <button mat-icon-button *ngIf="entry.hasDocuments" (click)="viewDocuments(entry)">
                  <mat-icon>description</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                class="hover:bg-gray-50"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]"
                        showFirstLastButtons
                        aria-label="Select page of ledger entries">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
    `,
})
export class AccountLedgerCard implements OnInit {
    @Input() ledgerEntries: Observable<LedgerEntry[] | undefined> = of(undefined);
    @Output() selectedAccount = new EventEmitter<AccountLedger>();
    @Output() editAccount = new EventEmitter<AccountLedger>();
    @Output() viewHistory = new EventEmitter<AccountLedger>();

    journalEntryFacade = inject(JournalEntryFacade);
    displayedColumns: string[] = ['date', 'description', 'debit', 'credit', 'balance', 'postReference', 'documents'];
    dataSource!: MatTableDataSource<LedgerEntry>;
  
    openingBalance = 10000;
    currentBalance = 15250;
    pendingCount = 2;

  constructor() {
    this.ledgerEntries.pipe(
      map(entries => this.dataSource = new MatTableDataSource(entries))
    )
  }

  ngOnInit() {
    
  }

  openFilters() {
    // Implement filter dialog
  }

  exportData() {
    // Implement export functionality
  }
  viewDocuments(entry: LedgerEntry) {
    // Implement document viewer
    console.log(`Viewing documents for entry dated: ${entry.date}`);
  }

    viewJournalEntry(postReference: string): void {
        this.journalEntryFacade.selectEntry(postReference);
    }
}