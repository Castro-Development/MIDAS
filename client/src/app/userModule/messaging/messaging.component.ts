import { Component, inject, OnInit } from '@angular/core';
import { UserProfileStateService } from '../../shared/user/profile/user-profile-state.service';
import { UserModel } from '../../shared/dataModels/userModels/user.model';
import { firstValueFrom, Observable, map, pipe, combineLatest, BehaviorSubject, first } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NotificationFacade } from '../../shared/notification/notification.facade';
import { NotificationStateService } from '../../shared/notification/notification-state.service';
import { Message, MessageCategory, MessagePriority, MessageStatus } from '../../shared/dataModels/messageModel/message.model';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { Timestamp } from '@angular/fire/firestore';
import { CommonService } from '../../shared/common.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss'
})
export class MessagingComponent implements OnInit{


  notificationFacade = inject(NotificationFacade);
  notificationState = inject(NotificationStateService);
  userProfileState = inject(UserProfileStateService);
  userService = inject(UserFirestoreService);

  public common = inject(CommonService);

  currentUser!: UserModel;

  allUsers$ = this.userService.getAllUsers();

  selectedCategorySubject = new BehaviorSubject<MessageCategory | null>(null);
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  currentMessages$ = this.notificationState.notifications$;
  messageList!: Message[]

  unreadCount$ = this.notificationState.unreadCount$;
  filteredMessages$ = this.notificationState.filteredNotifications$;

  userMessages$ = this.currentMessages$;

  userEmails$ = this.currentMessages$.pipe(
    map((notifications) => notifications.filter((notification) => notification.category === MessageCategory.USER_MESSAGE))
  )
  userAlerts$ = this.currentMessages$.pipe(
    map((notifications) => notifications.filter((notification) => notification.category === MessageCategory.SYSTEM_ALERT))
  )
  userWorkflow$ = this.currentMessages$.pipe(
    map((notifications) => notifications.filter((notification) => notification.category === MessageCategory.WORKFLOW))
  )
  userSentMessages$!: Observable<Notification[]>




  messageByCategory = combineLatest([
    this.currentMessages$,
    this.selectedCategory$
  ]).pipe(
    map(([notifications, category]) =>
      category ? notifications.filter(n => n.category === category) : notifications
    )
  );

  selectedMessage = this.notificationState.selectedMessage$;
  currentMessage!: Message;


  fb = inject(FormBuilder);
  messageForm!: FormGroup;

  //Variable to hide tabs
  showMessageList = true;
  showMessageView = false;
  showMessageSend = false;


  selectedMessageTitle = this.selectedMessage.pipe(
    map((message) => message?.subject)
  )
  selectedMessageType = this.selectedMessage.pipe(
    map((message) => message?.category.toString())
  )
  selectedMessageTime = this.selectedMessage.pipe(
    map((message) => message?.createdAt)
  )
  selectedMessageSenderUid = this.selectedMessage.pipe(
    map((message) => message?.sender)
  )
  selectedMessageRecipientUid = this.selectedMessage.pipe(
    map((message) => message?.recipients)
  )
  selectedMessageContent = this.selectedMessage.pipe(
    map((message) => message?.content)
  )







  constructor(){


  }

  ngOnInit(): void {
    this.createForm();
    this.messageByCategory.subscribe((messages) =>{
      this.messageList = messages;

    });
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

    this.notificationFacade.sendUserMessage(this.messageForm.value.recipientUid, {
      id: '',
      //category: MessageCategory.USER_MESSAGE,
      category: this.messageForm.value.type,
      priority: MessagePriority.MEDIUM,
      status: MessageStatus.UNREAD,
      sender: this.currentUser.id,
      //recipients: [this.messageForm.value.recipientUid],
      recipients: this.messageForm.value.recipientUid,
      subject: this.messageForm.value.title,
      content: this.messageForm.value.message,
      } as Message);
    //this.notifications.createNotification(this.currentUser.id, notificationId, this.message)
  }

  deleteMessage(messageId: string){
    this.notificationState.deleteNotification(messageId);
  }

  clear(){
    this.messageForm.reset();
  }

  showEmails(){
    this.selectedCategorySubject.next(MessageCategory.USER_MESSAGE);
  }

  showAlerts(){
    this.selectedCategorySubject.next(MessageCategory.SYSTEM_ALERT);
  }

  showWorkflow(){
    this.selectedCategorySubject.next(MessageCategory.WORKFLOW);
  }

  showAll(){
    firstValueFrom(this.allUsers$).then((users) => {console.log(users)});
    this.selectedCategorySubject.next(null);
  }

  selectMessage(messageId: string) {
    this.notificationState.selectMessage(messageId);
    this.showMessageList = false;
    this.showMessageView = true;
    this.selectedMessage.subscribe({next: (message) => {
      if(message != undefined) {
        this.currentMessage = message;
      }

    },
    error: (err) => {
      console.error('Error fetching articles:', err);
    }

    });
  }

  messageReturn(){
    this.showMessageList = true;
    this.showMessageView = false;
  }

  convertTimestamp(timestamp: Date | Timestamp): Date {
    if (timestamp instanceof Date) return timestamp;
    return timestamp.toDate();
  }

  lengthOfMessageList(arg0: Message[]): number {
    if(arg0 === undefined || arg0 === null) return 0;

    return arg0.length;
  }

  displayUser(id: string){
    //const name: string = "";
    const user = this.userService.getUserObservable(id);
    const senderName = user.pipe(
      map((user) => user.firstname + " "+ user.lastname)
    )
    // senderName.subscribe(
    //   (info)=>{
    //     const name: string = info;
    //     return name;
    //   }
    // )
    return senderName;
  }


}
