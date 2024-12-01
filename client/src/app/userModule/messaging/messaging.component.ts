import { Component, inject, OnInit } from '@angular/core';
import { UserProfileStateService } from '../../shared/user/profile/user-profile-state.service';
import { UserModel } from '../../shared/dataModels/userModels/user.model';
import { firstValueFrom, Observable, map, pipe } from 'rxjs';
import { NotificationFirestoreService } from '../../shared/notification/notification-firestore.service';
import { Notification, UserNotification } from '../../shared/dataModels/messageModel/message.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NotificationFacade } from '../../shared/notification/notification.facade';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss'
})
export class MessagingComponent implements OnInit{

  userProfileState = inject(UserProfileStateService);
  notificationFacade = inject(NotificationFacade);
  notifications = inject(NotificationFirestoreService);

  currentUser!: UserModel;

  currentMessages$!: Observable<Notification[]> // Holds the current message, swap to update message div.
  filteredMessages$!: Observable<Notification[]>

  userNotifications$!: Observable<Notification[]>
  userMessages$!: Observable<Notification[]>
  userSentMessages$!: Observable<Notification[]>

  message!: Notification;
  //viewedMessage!:Notification; // For sending Messages

  fb = inject(FormBuilder);
  messageForm!: FormGroup;

  //Variable to hide tabs
  showMessageList = true;
  showMessageView = false;
  showMessageSend = false;


  constructor(){


  }

  ngOnInit(): void {
    this.userNotifications$ = this.notifications.getUserNotifications(this.currentUser.id);
    this.createForm();
  }

  createForm(){
    this.userProfileState.activeProfile$.subscribe((user) => {
      this.currentUser = user;
      this.messageForm = this.fb.group({
        title: ["", Validators.required],
        type: ["UserMessage", Validators.required],
        recipientUid: ["", Validators.required],
        message: ["", Validators.required],
      });
    });
  }

  sendMessage(){
    this.notificationFacade.sendUserNotification(this.messageForm.value.recipientUid, this.messageForm.value.title, this.messageForm.value.type, this.messageForm.value.message,);
    //this.notifications.createNotification(this.currentUser.id, notificationId, this.message)
  }

  clear(){
    this.messageForm.reset();
  }

  showNotifications(){
    this.currentMessages$ = this.userNotifications$;
  }

  showMessages(){
    this.currentMessages$ = this.userMessages$;
  }

  showSent(){
    this.currentMessages$ = this.userSentMessages$;
  }

  viewMessage(message: Notification){
    this.message = message;
  }



}
