import { Injectable, inject } from "@angular/core";
import { NotificationFirestoreService } from "./notification-firestore.service";
import { NotificationStateService } from "./notification-state.service";
import { Timestamp } from "firebase/firestore";
import { Notification } from "../dataModels/messageModel/message.model";


@Injectable({ providedIn: 'root' })
export class NotificationFacade {
    
    notificationService = inject(NotificationFirestoreService);
    notificationState = inject(NotificationStateService);
    constructor() {
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
            id: notificationId
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
            id: notificationId
        } as Notification);
    }
}