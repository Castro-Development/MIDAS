import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { UserModel } from '../../shared/dataModels/userModels/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users-chart',
  templateUrl: './admin-users-chart.component.html',
  styleUrl: './admin-users-chart.component.scss'
})
export class AdminUsersChartComponent {

  //userService = inject(UserFirestoreService);
  //users$ = this.userService.getAllUsers;

  userService = inject(UserFirestoreService);
  router = inject(Router);
  users$ = this.userService.getAllUsers();
  userCount$ = this.users$.pipe(map(users => users.length));

  constructor(){

  }

  editUser(user: any) {
    this.router.navigate(['/admin-edit-user'], { queryParams: { data: JSON.stringify(user) } });
  }


}
