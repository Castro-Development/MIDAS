import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { Router } from '@angular/router';
import { Message, MessageCategory, MessagePriority, MessageStatus, MessageMetadata, MessageTemplates} from '../../shared/dataModels/messageModel/message.model';
import { NotificationFacade } from '../../shared/notification/notification.facade';
import { CommonService } from '../../shared/common.service';



@Component({
  selector: 'app-admin-expired-password-report',
  templateUrl: './admin-expired-password-report.component.html',
  styleUrl: './admin-expired-password-report.component.scss'
})
export class AdminExpiredPasswordReportComponent {
  router = inject(Router);
  userService = inject(UserFirestoreService);
  users$ = this.userService.getAllUsers();
  userCount$ = this.users$.pipe(map(users => users.length));

  notificationFacade = inject(NotificationFacade);
  expiredNotification = MessageTemplates.PASSWORD_EXPIRY;
  common = inject(CommonService)

  constructor(){

  }


  // editUser(user: any) {
  //   this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  // }
  decideUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }

  isExpired(user: UserModel){
    if(user.lastPWUpdate == undefined || null){ return false};

    if(this.calculateDiff(user.lastPWUpdate) >= 30 ){
      return true;
    }
    else return false;
  }

  calculateDiff(dateSent: Date | undefined){

    if(dateSent == undefined){
      return 0;
    }
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  notifyUser(user: UserModel){
    // if(this.isExpired(user)){
    //   this.expiredNotification.content = (days: number) => ""+ this.calculateDiff(user.lastPWUpdate)*-1;
    //   this.notificationFacade.sendPasswordExpiryNotification(user)
    // }
    if((30 - this.calculateDiff(user.lastPWUpdate)) <= 3){
      this.notificationFacade.sendPasswordExpiryNotification(user);
      alert("User has been notified!")
    }
    else{
      alert("It is too early to notify this user! User has "+ (30 - this.calculateDiff(user.lastPWUpdate)) + " days left" );
    }
  }

  nofityAll(){

  }
}
