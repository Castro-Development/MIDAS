import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ErrorHandlingService } from '../errorHandling/error-handling.service';
import { Notification } from '../dataModels/messageModel/message.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationFirestoreService {
  private readonly COLLECTION_NAME = 'notifications';
  
  constructor(
    private firestore: Firestore,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getUserNotifications(userId: string): Observable<Notification[]> {
    return new Observable(subscriber => {
      const userNotificationsRef = collection(
        this.firestore, 
        this.COLLECTION_NAME, 
        userId, 
        'userNotifications'
      );

      const unsubscribe = onSnapshot(
        userNotificationsRef,
        (snapshot) => {
          const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Notification));
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
    notificationId: string, 
    notification: Notification
  ): Promise<void> {
    try {
      const notificationRef = doc(
        this.firestore, 
        this.COLLECTION_NAME, 
        userId, 
        'userNotifications',
        notificationId
      );

      await setDoc(notificationRef, {
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
    changes: Partial<Notification>
  ): Promise<void> {
    try {
      const notificationRef = doc(
        this.firestore,
        this.COLLECTION_NAME,
        userId,
        'userNotifications',
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
}