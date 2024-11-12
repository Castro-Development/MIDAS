import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, finalize } from 'rxjs/operators';
import { EventBusService, EventType } from '../../services/event-bus.service';
import { ErrorHandlingService } from '../../services/error-handling.service';

interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  submitterId: string;
  approverId?: string;
  entityId: string;  // ID of the item needing approval (journal entry, application, etc.)
  entityType: EntityType;
  metadata: ApprovalMetadata;
}

interface ApprovalMetadata {
  submittedAt: Date;
  dueBy?: Date;
  priority: ApprovalPriority;
  notes?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  reason?: string;
  lastModified: Date;
  notificationsSent: NotificationRecord[];
}

interface NotificationRecord {
  type: 'EMAIL' | 'ALERT' | 'SYSTEM';
  sentAt: Date;
  recipient: string;
  successful: boolean;
}

enum ApprovalType {
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  USER_APPLICATION = 'USER_APPLICATION',
  ACCOUNT_MODIFICATION = 'ACCOUNT_MODIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

enum EntityType {
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  USER_APPLICATION = 'USER_APPLICATION',
  ACCOUNT = 'ACCOUNT',
  USER = 'USER'
}

enum ApprovalPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

@Injectable({
  providedIn: 'root'
})
export class ApprovalNotificationFacade {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly pendingApprovalsSubject = new BehaviorSubject<ApprovalRequest[]>([]);
  private readonly currentApprovalSubject = new BehaviorSubject<ApprovalRequest | null>(null);

  readonly loading$ = this.loadingSubject.asObservable();
  readonly pendingApprovals$ = this.pendingApprovalsSubject.asObservable();
  readonly currentApproval$ = this.currentApprovalSubject.asObservable();

  // Derived observables
  readonly urgentApprovals$ = this.pendingApprovals$.pipe(
    map(approvals => approvals.filter(a => a.metadata.priority === ApprovalPriority.URGENT))
  );

  readonly approvalsByType$ = (type: ApprovalType) => this.pendingApprovals$.pipe(
    map(approvals => approvals.filter(a => a.type === type))
  );

  constructor(
    // private emailNotification: EmailNotificationFacade,
    private errorHandling: ErrorHandlingService,
    private eventBus: EventBusService
  ) {
    // Listen for events that require approvals
    this.subscribeToApprovalEvents();
  }

  /**
   * Create new approval request
   */
  createApprovalRequest(
    type: ApprovalType,
    entityId: string,
    entityType: EntityType,
    submitterId: string,
    options: Partial<ApprovalRequest> = {}
  ): Observable<void> {
    this.loadingSubject.next(true);

    const request: ApprovalRequest = {
      id: crypto.randomUUID(),
      type,
      status: ApprovalStatus.PENDING,
      submitterId,
      entityId,
      entityType,
      metadata: {
        submittedAt: new Date(),
        priority: ApprovalPriority.NORMAL,
        lastModified: new Date(),
        notificationsSent: [],
        ...options.metadata
      }
    };

    return this.validateApprovalRequest(request).pipe(
      switchMap(() => this.saveApprovalRequest(request)),
      tap(() => this.notifyApprovers(request)),
      catchError(() => {return this.errorHandling.handleError('createApprovalRequest', void 0)}),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Approve a request
   */
  approveRequest(
    requestId: string,
    approverId: string,
    notes?: string
  ): Observable<void> {
    this.loadingSubject.next(true);

    return this.getApprovalRequest(requestId).pipe(
      switchMap(request => {
        if (!request) {
          return throwError(() => new Error('Approval request not found'));
        }

        const updatedRequest = {
          ...request,
          status: ApprovalStatus.APPROVED,
          approverId,
          metadata: {
            ...request.metadata,
            approvedAt: new Date(),
            notes,
            lastModified: new Date()
          }
        };

        return this.saveApprovalRequest(updatedRequest).pipe(
          tap(() => this.notifyRequestor(updatedRequest, 'APPROVED'))
        );
      }),
      catchError(() => {return this.errorHandling.handleError('approveRequest', void 0)}),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Reject a request
   */
  rejectRequest(
    requestId: string,
    approverId: string,
    reason: string
  ): Observable<void> {
    this.loadingSubject.next(true);

    return this.getApprovalRequest(requestId).pipe(
      switchMap(request => {
        if (!request) {
          return throwError(() => new Error('Approval request not found'));
        }

        const updatedRequest = {
          ...request,
          status: ApprovalStatus.REJECTED,
          approverId,
          metadata: {
            ...request.metadata,
            rejectedAt: new Date(),
            reason,
            lastModified: new Date()
          }
        };

        return this.saveApprovalRequest(updatedRequest).pipe(
          tap(() => this.notifyRequestor(updatedRequest, 'REJECTED'))
        );
      }),
      catchError(() => {return this.errorHandling.handleError('rejectRequest', void 0)}),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Load pending approvals for a specific approver
   */
  loadPendingApprovals(approverId: string): Observable<ApprovalRequest[] | null> {
    this.loadingSubject.next(true);

    return this.fetchPendingApprovals(approverId).pipe(
      tap(approvals => this.pendingApprovalsSubject.next(approvals)),
      catchError(() => {return this.errorHandling.handleError('loadPendingApprovals', null)}),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private notifyApprovers(request: ApprovalRequest): void {
    // Send email notification
    this.emailNotification.sendEmailNotification(
      this.getApproverEmails(request),
      this.getEmailTemplate(request),
      {
        requestId: request.id,
        entityType: request.entityType,
        submitter: request.submitterId,
        priority: request.metadata.priority
      }
    ).subscribe(() => {
      this.updateNotificationRecord(request.id, {
        type: 'EMAIL',
        sentAt: new Date(),
        recipient: 'approvers',
        successful: true
      });
    });

    // Send system alert
    this.alertFacade.showAlert(
      `New ${request.type} requires your approval`,
      AlertType.INFO,
      this.mapPriorityToAlertPriority(request.metadata.priority),
      {
        action: {
          label: 'Review Now',
          route: `/approvals/${request.id}`
        }
      }
    );
  }

  private notifyRequestor(request: ApprovalRequest, decision: 'APPROVED' | 'REJECTED'): void {
    const template = decision === 'APPROVED' ? 
      this.getApprovedTemplate(request) : 
      this.getRejectedTemplate(request);

    this.emailNotification.sendEmailNotification(
      [this.getRequestorEmail(request.submitterId)],
      template,
      {
        requestId: request.id,
        entityType: request.entityType,
        reason: request.metadata.reason
      }
    ).subscribe();

    this.alertFacade.showAlert(
      `Your ${request.type} has been ${decision.toLowerCase()}`,
      decision === 'APPROVED' ? AlertType.SUCCESS : AlertType.WARNING
    );
  }

  private getEmailTemplate(request: ApprovalRequest): EmailTemplate {
    switch (request.type) {
      case ApprovalType.JOURNAL_ENTRY:
        return EmailTemplate.JOURNAL_ENTRY_APPROVAL_NEEDED;
      case ApprovalType.USER_APPLICATION:
        return EmailTemplate.USER_APPLICATION_APPROVAL_NEEDED;
      default:
        return EmailTemplate.APPROVAL_NEEDED;
    }
  }

  private validateApprovalRequest(request: ApprovalRequest): Observable<boolean> {
    const errors: string[] = [];

    if (!request.entityId) {
      errors.push('Entity ID is required');
    }

    if (!request.submitterId) {
      errors.push('Submitter ID is required');
    }

    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    }

    return of(true);
  }

  // Firebase integration methods - to be implemented
  private saveApprovalRequest(request: ApprovalRequest): Observable<void> {
    // Implement Firestore save
    return of(void 0);
  }

  private getApprovalRequest(id: string): Observable<ApprovalRequest | null> {
    // Implement Firestore get
    return of(null);
  }

  private fetchPendingApprovals(approverId: string): Observable<ApprovalRequest[]> {
    // Implement Firestore query
    return of([]);
  }

  private subscribeToApprovalEvents(): void {
    this.eventBus.onMany([
      EventType.JOURNAL_ENTRY_SUBMITTED,
      EventType.USER_APPLICATION_SUBMITTED,
      EventType.ACCOUNT_MODIFICATION_REQUESTED
    ]).subscribe(event => {
      this.handleApprovalEvent(event);
    });
  }

  private handleApprovalEvent(event: any): void {
    switch (event.type) {
      case EventType.JOURNAL_ENTRY_SUBMITTED:
        this.createApprovalRequest(
          ApprovalType.JOURNAL_ENTRY,
          event.payload.id,
          EntityType.JOURNAL_ENTRY,
          event.payload.submitterId
        ).subscribe();
        break;
      // Add more event handlers
    }
  }
}