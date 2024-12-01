import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-admin-user-applications',
  templateUrl: './admin-user-applications.component.html',
  styleUrl: './admin-user-applications.component.scss'
})
export class AdminUserApplicationsComponent {

  router = inject(Router);
  userService = inject(UserFirestoreService);
  users$ = this.userService.getAllApplications();
  userCount$ = this.users$.pipe(map(users => users.length));
  numb: number = 10;

  constructor(){}


  // editUser(user: any) {
  //   this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  // }
  decideUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }
}
