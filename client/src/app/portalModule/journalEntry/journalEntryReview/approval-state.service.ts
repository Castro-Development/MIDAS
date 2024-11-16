import { Injectable } from "@angular/core";
import { Firestore, collection, onSnapshot, setDoc, doc, updateDoc, arrayUnion, getDoc } from "@angular/fire/firestore";
import { BehaviorSubject, Observable, catchError, distinctUntilChanged, from, map, switchMap, tap, throwError } from "rxjs";
import { ErrorHandlingService } from "../../../shared/errorHandling/error-handling.service";
import { JournalEntry, JournalEntryStatus } from "../../../shared/dataModels/financialModels/account-ledger.model";

@Injectable({ providedIn: 'root' })
export class ApprovalStateService {
  // Internal state management
  private readonly pendingEntriesSubject = new BehaviorSubject<Record<string, PendingEntry[]>>({});
  private readonly approvalWorkflowSubject = new BehaviorSubject<Record<string, ApprovalWorkflow>>({});

  // Public observables
  readonly pendingEntries$ = this.pendingEntriesSubject.asObservable();
  readonly approvalWorkflows$ = this.approvalWorkflowSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private errorHandling: ErrorHandlingService,
  ) {
    // Initialize real-time listeners for pending entries
    this.initializePendingEntriesListener();
  }

  // Core pending entry methods
  getPendingEntries(accountId: string, filter?: EntryFilter): Observable<PendingEntry[]> {
    return this.pendingEntries$.pipe(
      map(entries => entries[accountId] || []),
      map(entries => this.applyFilter(entries, filter)),
      distinctUntilChanged()
    );
  }


  // Approval workflow methods
  submitForApproval(entry: JournalEntry): Observable<void> {
    const pendingEntry: PendingEntry = {
      ...entry,
      status: JournalEntryStatus.PENDING,
      submittedAt: new Date(),
      approvalHistory: [],
      accounts: entry.accounts
    };

    return from(
      setDoc(
        doc(this.firestore, `pendingEntries/${entry.id}`),
        pendingEntry
      )
    ).pipe(
      tap(() => {
        // Emit event for notification system
        this.eventBus.emit({
          type: EventType.JOURNAL_ENTRY_SUBMITTED,
          payload: pendingEntry
        });
      }),
      catchError(error => this.errorHandling.handleError(
        'submitForApproval',
        void 0,
      ))
    );
  }

  approveEntry(entryId: string, approvalForm: ApprovalDTO): Observable<void> {
    return this.getEntryById(entryId).pipe(
      switchMap(entry => {
        if (!entry) {
          return throwError(() => new Error('Entry not found'));
        }

        const approvalRecord: ApprovalRecord = {
          status: 'APPROVED',
          approvedAt: new Date(),
          approverNotes: approvalForm.approverNotes,
          approver: approvalForm.approverUid
        };

        return from(
          updateDoc(
            doc(this.firestore, `pendingEntries/${entryId}`),
            {
              status: 'APPROVED',
              approvalHistory: arrayUnion(approvalRecord)
            }
          )
        );
      }),
      tap(() => {
        this.eventBus.emit({
          type: EventType.JOURNAL_ENTRY_APPROVED,
          payload: { entryId }
        });
      })
    );
  }

  rejectEntry(entryId: string, rejectionReason: string): Observable<void> {
    return this.getEntryById(entryId).pipe(
      switchMap(entry => {
        if (!entry) {
          return throwError(() => new Error('Entry not found'));
        }

        const rejectionRecord: RejectionRecord = {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectionReason,
          rejectedBy: 'TODO: Get current user' // You'd get this from auth service
        };

        return from(
          updateDoc(
            doc(this.firestore, `pendingEntries/${entryId}`),
            {
              status: 'REJECTED',
              approvalHistory: arrayUnion(rejectionRecord)
            }
          )
        );
      }),
      tap(() => {
        this.eventBus.emit({
          type: EventType.JOURNAL_ENTRY_REJECTED,
          payload: { entryId }
        });
      })
    );
  }

  // Private helper methods
  private initializePendingEntriesListener(): void {
    const pendingEntriesRef = collection(this.firestore, 'pendingEntries');
    
    onSnapshot(pendingEntriesRef, 
      (snapshot) => {
        const entriesByAccount: Record<string, PendingEntry[]> = {};
        
        snapshot.docs.forEach(doc => {
          const entry = doc.data() as PendingEntry;
          entry.accounts.forEach(accountId => {
            if (!entriesByAccount[accountId]) {
              entriesByAccount[accountId] = [];
            }
            entriesByAccount[accountId].push(entry);
          });
        });

        this.pendingEntriesSubject.next(entriesByAccount);
      },
      error => {
        this.errorHandling.handleError(
          'pendingEntriesListener',
          error
        );
      }
    );
  }

  private getEntryById(entryId: string): Observable<PendingEntry | null> {
    return from(
      getDoc(doc(this.firestore, `pendingEntries/${entryId}`))
    ).pipe(
      map(doc => doc.exists() ? (doc.data() as PendingEntry) : null)
    );
  }


  private applyFilter(entries: PendingEntry[], filter?: EntryFilter): PendingEntry[] {
    if (!filter) return entries;

    return entries.filter(entry => {
      if (filter.status && entry.status !== filter.status) {
        return false;
      }
      if (filter.dateRange) {
        const entryDate = new Date(entry.date);
        return entryDate >= filter.dateRange.start && 
               entryDate <= filter.dateRange.end;
      }
      return true;
    });
  }
}

// Supporting interfaces
interface PendingEntry extends JournalEntry {
  status: JournalEntryStatus;
  submittedAt: Date;
  approvalHistory: (ApprovalRecord | RejectionRecord)[];
  accounts: string[]; // List of affected account IDs
}

interface ApprovalRecord {
  status: 'APPROVED';
  approvedAt: Date;
  approver: string;
  approverNotes?: string;
}

interface RejectionRecord {
  status: 'REJECTED';
  rejectedAt: Date;
  rejectedBy: string;
  rejectionReason: string;
}

interface EntryFilter {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface ApprovalWorkflow {
  entryId: string;
  currentApprover: string;
  requiredApprovers: string[];
  approvalSequence: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
}

interface ApprovalDTO {
    approverUid: string;
    approverNotes?: string;
}