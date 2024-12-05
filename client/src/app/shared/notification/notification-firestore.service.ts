import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  addDoc
} from '@angular/fire/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { Message, MessageStatus } from '../dataModels/messageModel/message.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationFirestoreService {
  
  private readonly COLLECTION_NAME = 'notifications';
  

  constructor(
    private firestore: Firestore,
    private errorHandlingService: ErrorHandlingService
  ) {}
  

  getUserNotifications(userId: Observable<string>): Observable<Message[]> {
    return userId.pipe(
      switchMap(userId => this.getUserNotificationsByUserId(userId))
    )
  }

  getSystemAlerts(): Observable<Message[]> {
    return new Observable(subscriber => {
      const systemAlertsRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        'all'
      );

      const unsubscribe = onSnapshot(
        systemAlertsRef,
        (snapshot) => {
          const alerts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Message));
          subscriber.next(alerts);
        },
        error => {
          this.errorHandlingService.handleError('Failed to get system alerts', error);
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    })
  }

  getAdminMessages(): Observable<Message[]> {
    return new Observable(subscriber => {
      const adminMessagesRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        'admin'
      );

      const unsubscribe = onSnapshot(
        adminMessagesRef,
        (snapshot) => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Message));
          subscriber.next(messages);
        },
        error => {
          this.errorHandlingService.handleError('Failed to get admin messages', error);
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  private getUserNotificationsByUserId(userId: string): Observable<Message[]> {
    return new Observable(subscriber => {
      if(userId === null || userId.length < 3) {throw new Error('No user ID provided');}
      const userNotificationsRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        userId,
        'userNotifications'
      );
      console.log('userNotificationsRef', userNotificationsRef);
      console.log('Getting User\'s Notifications');

      const unsubscribe = onSnapshot(
        userNotificationsRef,
        (snapshot) => {
          const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Message));
          console.log(notifications);
          subscriber.next(notifications);
        },
        error => {
          this.errorHandlingService.handleError('Failed to get notifications', error);
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }



  async createNotification(
    userId: string,
    notification: Message
  ): Promise<void> {
    try {
      console.log(userId, notification);
      const notificationRef = collection(
        this.firestore,
        this.COLLECTION_NAME,
        userId,
        'userNotifications'
      );

      await addDoc(notificationRef, {
        ...notification,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to create notification', error);
      throw error;
    }
  }

  async updateNotification(
    userId: string,
    notificationId: string,
    changes: Partial<Message>
  ): Promise<void> {
    try {
      const notificationRef = doc(
        this.firestore,
        this.COLLECTION_NAME,
        userId,
        notificationId
      );

      await updateDoc(notificationRef, {
        ...changes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      this.errorHandlingService.handleError('Failed to update notification', error);
      throw error;
    }
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(
        this.firestore,
        this.COLLECTION_NAME,
        userId,
        'userNotifications',
        notificationId
      );

      await deleteDoc(notificationRef);
    } catch (error) {
      this.errorHandlingService.handleError('Failed to delete notification', error);
      throw error;
    }
  }

  markAsRead(userId$: Observable<string>, message: string) {
    userId$.pipe(
      map(userId => this.updateNotification(userId, message, {status: MessageStatus.READ}))
    )
  }
}
