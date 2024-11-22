import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/services/firestoreService/user-firestore.service';
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
  users$ = this.userService.getAllApplications();
  userCount$ = this.users$.pipe(map(users => users.length));

  constructor(){}


  // editUser(user: any) {
  //   this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  // }
  decideUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }
}
