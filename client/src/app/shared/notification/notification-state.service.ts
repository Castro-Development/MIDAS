import { Injectable, inject } from "@angular/core";
import { type } from "os";
import { BehaviorSubject, map, distinctUntilChanged, combineLatest, shareReplay, Subject, takeUntil, catchError, tap, Observable, switchMap } from "rxjs";
import { FilteringService } from "../filter/filter.service";
import { ErrorHandlingService } from "../error-handling/error-handling.service";
import { NotificationFirestoreService } from "./notification-firestore.service";
import { Message, MessageCategory } from "../dataModels/messageModel/message.model";
import { UserProfileStateService } from "../user/profile/user-profile-state.service";




  
  @Injectable({ providedIn: 'root' })
  export class NotificationStateService {
    
    private notificationService = inject(NotificationFirestoreService);
    private userProfileState = inject(UserProfileStateService);

    private filterSubject = new Subject<typeof MessageCategory>();

    private userId$ = this.userProfileState.userProfile$.pipe(
      map((user) => user.id),
    )

    private destroySubject = new Subject<void>();
    private readonly destroy$ = this.destroySubject.asObservable();
    


    constructor(
      private filterService: FilteringService,
      private errorHandlingService: ErrorHandlingService,

      ) {
    }


    selectedMessageIdSubject = new BehaviorSubject<string | null>(null);
    private selectedMessageId$ = this.selectedMessageIdSubject.asObservable();
    selectedMessage$ = this.selectedMessageId$.pipe(
      takeUntil(this.destroy$),
      switchMap((id) => this.notificationService.getUserNotifications(this.userId$).pipe(
        map((notifications) => notifications.find((notification) => notification.id === id))
      ))
    )
    selectMessage(message: string) {
      this.selectedMessageIdSubject.next(message);
      this.notificationService.markAsRead(this.userId$, message);
    }
  
    readonly notifications$ = this.notificationService.getUserNotifications(this.userId$)
  
    readonly unreadCount$ = this.notifications$.pipe(
      map((notifications) => notifications.length)
    )


    readonly filteredNotifications$ = combineLatest([this.notifications$, this.filterSubject]).pipe(
      map(([notifications, filter]) => this.filterService.filter(notifications, filter, [
        'type',
        'priority',
        'category',
      ])),
      distinctUntilChanged(),
    );

    updateFilters(filter: typeof MessageCategory) {
      this.filterSubject.next(filter);
    }

    deleteNotification(messageId: string) {
      this.userId$.pipe(
        takeUntil(this.destroy$),
        switchMap((userId) => this.notificationService.deleteNotification(userId, messageId))
      )
    }
    
  }

  