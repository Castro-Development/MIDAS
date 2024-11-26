import { Injectable, inject } from "@angular/core";
import { NotificationFirestoreService } from "./notification-firestore.service";
import { NotificationStateService } from "./notification-state.service";
import { Timestamp } from "firebase/firestore";
import { Notification } from "../dataModels/messageModel/message.model";
import { UserNotification } from "../dataModels/messageModel/message.model";
import { UserProfileStateService } from "../user/profile/user-profile-state.service";
import { firstValueFrom, Observable, map, pipe } from 'rxjs';
import { UserModel } from "../dataModels/userModels/user.model";


@Injectable({ providedIn: 'root' })
export class NotificationFacade {

    notificationService = inject(NotificationFirestoreService);
    notificationState = inject(NotificationStateService);
    userProfileState = inject(UserProfileStateService);
    //user = this.userProfileState.activeProfile$;
    currentUser!:UserModel;

    constructor() {
      this.userProfileState.activeProfile$.subscribe((user) => {
        this.currentUser = user;
      });
    }

    sendApprovalNotification(applicationId: string){
        const notificationId = applicationId + Math.random() * 1000;
        this.notificationService.createNotification(applicationId, notificationId, {
            title: 'Application Approved',
            message: `Your application with ID: ${applicationId} has been approved.`,
            timestamp: new Date(),
            type: 'approval',
            recipientUid: applicationId,
            read: false,
            id: notificationId,
        } as Notification);

    }

    sendApplicationRejectionNotification(applicationId: string, reason: string) {
        const notificationId = applicationId + Math.random() * 1000;
        this.notificationService.createNotification(applicationId, notificationId, {
            title: 'Application Rejected',
            message: `Your application with ID: ${applicationId} has been rejected. Reason: ${reason}`,
            timestamp: new Date(),
            type: 'rejection',
            recipientUid: applicationId,
            read: false,
            id: notificationId,
        } as Notification);
    }

    sendUserNotification(recipientId: string, title: string, type: string, message: string) {
      this.userProfileState
      const notificationId = recipientId + Math.random() * 1000;
      this.notificationService.createNotification(recipientId, notificationId, {
          title: title,
          message: message,
          timestamp: new Date(),
          type: type,
          recipientUid: recipientId,
          read: false,
          id: notificationId,
          senderUid: this.currentUser.id,
      } as UserNotification);
  }
}
