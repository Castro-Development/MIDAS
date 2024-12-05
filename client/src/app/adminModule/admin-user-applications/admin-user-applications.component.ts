import { Component, inject } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/common.service';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-admin-user-applications',
  templateUrl: './admin-user-applications.component.html',
  styleUrl: './admin-user-applications.component.scss'
})
export class AdminUserApplicationsComponent {

  public common = inject(CommonService);

  router = inject(Router);
  userService = inject(UserFirestoreService);
  users$ = this.userService.getAllApplications();
  userCount$ = this.users$.pipe(map(users => users.length));
  numb: number = 10;
  userSet!: UserApplicationWithMetaData[];

  constructor(){
    this.users$.subscribe(data=>{
      this.userSet = data;
    })

  }


  editUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }
  decideUser(user: any) {
    this.router.navigate(['/admin-app-form'], { queryParams: { data: JSON.stringify(user) } });
  }

  convertDate(date: Date | undefined){
    //let latest_date = this.datepipe.transform(date, 'MMMM dd, yyyy');
    if(date != undefined){
      let latest_date = formatDate(date,'MM/dd/yyyy', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }
}
