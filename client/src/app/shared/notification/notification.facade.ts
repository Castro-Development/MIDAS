import { Injectable, inject } from "@angular/core";
import { NotificationFirestoreService } from "./notification-firestore.service";
import { NotificationStateService } from "./notification-state.service";
import { Timestamp } from "firebase/firestore";
import { UserProfileStateService } from "../user/profile/user-profile-state.service";
import { firstValueFrom, Observable, map, pipe } from 'rxjs';
import { UserModel } from "../dataModels/userModels/user.model";
import { Message, MessageAction, MessageCategory, MessagePriority, MessageStatus, WorkflowType } from "../dataModels/messageModel/message.model";


@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  

    notificationService = inject(NotificationFirestoreService);
    notificationState = inject(NotificationStateService);
    userProfileState = inject(UserProfileStateService);

    constructor() {
    }

    


    /*
    * Send Password Expiration Warning
    * @param user: UserModel
    */
    sendPasswordExpiryNotification(user: UserModel){
      this.notificationService.createNotification(user.id, {
        id: '',
        category: MessageCategory.SYSTEM_ALERT,
        priority: MessagePriority.URGENT,
        status: MessageStatus.UNREAD,
        sender: 'SYSTEM',
        recipients: [user.id],
        subject: 'Password Expiration Warning',
        content: 'Your password will expire in 3 days. Please update your password.',
        metadata: {
          category: MessageCategory.SYSTEM_ALERT,
          requiresEmail: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as Message)
    }

    /*
    * Send System-wide Alert
    * @param message: Message
    */
    sendSystemAlert(message: Message){
      this.notificationService.createNotification('all', {
        id: '',
        category: MessageCategory.SYSTEM_ALERT,
        priority: MessagePriority.URGENT,
        status: MessageStatus.UNREAD,
        sender: 'SYSTEM',
        recipients: ['all'],
        subject: message.subject,
        content: message.content,
        metadata: {
          category: MessageCategory.SYSTEM_ALERT,
          requiresEmail: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as Message)
      
    }

    /*
    * Send User a Message
    * @param user: UserModel
    * @param message: Message
    */
    sendUserMessage(userId: string, message: Message){
      this.notificationService.createNotification(userId, {
        id: '',
        category: MessageCategory.USER_MESSAGE,
        priority: MessagePriority.MEDIUM,
        status: MessageStatus.UNREAD,
        sender: 'SYSTEM',
        recipients: [userId],
        subject: message.subject,
        content: message.content,
        metadata: {
          category: MessageCategory.USER_MESSAGE,
          requiresEmail: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as Message)
    }

    /*
    * Send Workflow Notification
    * @param recipient: UserModel
    * @param message: Message
    * @param workflowType: WorkflowType
    */
    sendWorkflowNotification(recipientId: string, message: Message, workflowType: WorkflowType){
      this.notificationService.createNotification(recipientId, {
        id: '',
        category: MessageCategory.WORKFLOW,
        priority: MessagePriority.MEDIUM,
        status: MessageStatus.UNREAD,
        sender: 'SYSTEM',
        recipients: [recipientId],
        subject: message.subject,
        content: message.content,
        metadata: {
          category: MessageCategory.WORKFLOW,
          sourceEntity: {
            type: workflowType,
            id: message.id
          },
          requiresEmail: true,
          action: message.metadata.action
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as Message)
    }


  


  
}
