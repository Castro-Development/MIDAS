import { Injectable } from "@angular/core";
import { type } from "os";
import { BehaviorSubject, map, distinctUntilChanged, combineLatest, shareReplay, Subject, takeUntil, catchError, tap } from "rxjs";
import { FilteringService } from "../filter/filter.service";
import { ErrorHandlingService } from "../errorHandling/error-handling.service";
import { NotificationFirestoreService } from "./notification-firestore.service";

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
      private notificationService: NotificationFirestoreService,
      private filterService: FilteringService,
      private errorHandlingService: ErrorHandlingService

      ) {
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

  