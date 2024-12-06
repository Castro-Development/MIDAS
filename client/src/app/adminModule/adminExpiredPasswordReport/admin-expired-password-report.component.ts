import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { Router } from '@angular/router';


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

  constructor(){}


  // editUser(user: any) {
  //   this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  // }
  decideUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }

  isExpired(user: UserModel){
    if(user.lastPWUpdate != undefined){
      if(this.calculateDiff(user.lastPWUpdate) > 0 ){
        return true;
      }
      else return false;
    }
    else return false;
  }

  calculateDiff(dateSent: Date){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
  }
}
