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

  currentUser!: UserModel;
  notifications = inject(NotificationFirestoreService);
  userNotifications$!: Observable<Notification[]>

  message!: UserNotification;

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



}
