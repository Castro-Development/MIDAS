import { Injectable, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { UserProfileFacade } from './user/profile/user-profile.facade';
import { AuthStateService } from './user/auth/auth-state.service';
import { UserRole } from './dataModels/userModels/userRole.model';
import { distinctUntilChanged, map } from 'rxjs';

@Injectable({

  providedIn: 'root',

})

export class CommonService {
  // datepipe =  inject(DatePipe);

  constructor(){

  }

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

  convertTimestamp(timestamp: Date | Timestamp | undefined) {
    if(timestamp == undefined){
      return;
    }
    else if (timestamp instanceof Date){
      return timestamp;
    }
    return timestamp.toDate();
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


  getDay(date: Date | undefined){
    if(date != undefined){
      let latest_date = formatDate(date,'dd', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }
  getMonth(date: Date | undefined){
    if(date != undefined){
      let latest_date = formatDate(date,'MMM', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }

  getYear(date: Date | undefined){
    if(date != undefined){
      let latest_date = formatDate(date,'yyyy', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }



}
