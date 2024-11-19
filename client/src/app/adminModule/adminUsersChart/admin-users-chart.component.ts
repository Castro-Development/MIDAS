import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/services/firestoreService/user-firestore.service';
import { UserModel } from '../../shared/dataModels/userModels/user.model';

@Component({
  selector: 'app-admin-users-chart',
  templateUrl: './admin-users-chart.component.html',
  styleUrl: './admin-users-chart.component.scss'
})
export class AdminUsersChartComponent {

  //userService = inject(UserFirestoreService);
  //users$ = this.userService.getAllUsers;

  userService = inject(UserFirestoreService);
  users$ = this.userService.getAllUsers();
  userCount$ = this.users$.pipe(map(users => users.length));

  constructor(){


  }


}
