import { Injectable } from "@angular/core";
import { type } from "os";
import { BehaviorSubject, map, distinctUntilChanged, combineLatest, shareReplay, Subject, takeUntil, catchError, tap } from "rxjs";
import { NotificationService } from "../services/firestoreService/notification-firestore.service";
import { FilteringService } from "../services/filter.service";
import { ErrorHandlingService } from "../services/error-handling.service";

export interface NotificationFilter {
    type: 'all' | 'EMAIL' | 'ALERT' | 'SYSTEM';
    priority: 'all' | 'low' | 'medium' | 'high';
    category: 'all' | 'system' | 'approval' | 'alert';
}

export interface Notification{
    id: string;
    type: 'EMAIL' | 'ALERT' | 'SYSTEM';
    priority:  'low' | 'medium' | 'high';
    category: 'all' | 'system' | 'approval' | 'alert';
    read: boolean;
    sentAt: Date;
    recipient: string;
    successful: boolean;
}


  
  @Injectable({ providedIn: 'root' })
  export class NotificationStateService {
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    private filterSubject = new Subject<NotificationFilter>();
    private readonly notifications$ = this.notificationsSubject.asObservable();

    private destroySubject = new Subject<void>();
    private readonly destroy$ = this.destroySubject.asObservable();


    constructor(
      private notificationService: NotificationService,
      private filterService: FilteringService,
      private errorHandlingService: ErrorHandlingService

      ) {
        this.initializeNotificationState();
    }

    initializeNotificationState() {
      this.notificationService.notifications$.pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          return this.errorHandlingService.handleError(error, [] as Notification[]);
        }),
        tap(notifications => this.notificationsSubject.next(notifications)),
        
      );
    }
  
    readonly unreadCount$ = this.notifications$.pipe(
      map(notifications => notifications.filter(notification => !notification.read).length),
      distinctUntilChanged()
    );

    readonly filteredNotifications$ = combineLatest([this.notifications$, this.filterSubject]).pipe(
      map(([journalEntries, filter]) => this.filterService.filter(journalEntries, filter, [
        'type',
        'priority',
        'category',
      ])),
      distinctUntilChanged(),
    );

    updateFilters(filter: NotificationFilter) {
      this.filterSubject.next(filter);
    }
    
  }

  