import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/services/firestoreService/user-firestore.service';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-admin-user-applications',
  templateUrl: './admin-user-applications.component.html',
  styleUrl: './admin-user-applications.component.scss'
})
export class AdminUserApplicationsComponent {

  userService = inject(UserFirestoreService);
  users$ = this.userService.getAllApplications();
  userCount$ = this.users$.pipe(map(users => users.length));

  constructor(private router: Router){}


  editUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }
  decideUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }
}
