import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { UserProfileFacade } from '../../shared/user/profile/user-profile.facade';
import { UserRole } from '../../shared/dataModels/userModels/userRole.model';
import { NotificationFacade } from '../../shared/notification/notification.facade';
import { NotificationStateService } from '../../shared/notification/notification-state.service';
import { UserProfileStateService } from '../../shared/user/profile/user-profile-state.service';
import { CommonService } from '../../shared/common.service';
import { MessageCategory, Message } from '../../shared/dataModels/messageModel/message.model';
import { UserModel } from '../../shared/dataModels/userModels/user.model';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

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

  public profileFacade = inject(UserProfileFacade);
  public authState = inject(AuthStateService);

  isAny(){
    if(this.isAdmin$ || this.isAccountant$ || this.isManager$){
      return true;
    }
    else return false;
  }

  readonly isAdmin$ = this.profileFacade.userProfile$.pipe(
    map((profile) => profile?.role === UserRole.Administrator),
    distinctUntilChanged()
  );

  readonly isManager$ = this.profileFacade.userProfile$.pipe(
    map((profile) => profile?.role === UserRole.Manager),
    distinctUntilChanged()
  );

  readonly isAccountant$ = this.profileFacade.userProfile$.pipe(
    map((profile) => profile?.role === UserRole.Accountant),
    distinctUntilChanged()
  );



  constructor(private router: Router) {
    this.messageByCategory.subscribe((messages) =>{
      this.messageList = messages;

    });
  }


  logout() {
    this.authState.logout();
    console.log(this.authState.isLoggedIn$)
    this.router.navigate(['/login']);
  }

  logUserStatus() {
    combineLatest([this.authState.userProfile$, this.authState.user$]).subscribe(([profile, user]) => {
      console.log(profile, user);
    });
  }

  lengthOfMessageList(arg0: Message[]): number {
    if(arg0 === undefined || arg0 === null) return 0;

    return arg0.length;
  }



}
