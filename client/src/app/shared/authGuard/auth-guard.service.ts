// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../dataModels/userModels/userRole.model';
import { UserModel } from '../dataModels/userModels/user.model';
import { UserProfileFacade } from '../user/profile/user-profile.facade';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private userProfile: UserProfileFacade
  ) {}

  canActivate() {
    return this.userProfile.userProfileState.activeProfile$.pipe(
      map((user: UserModel | null) => {
        // If no user or role is guest, allow access
        if (!user || user.role === UserRole.Guest) {
          console.log('User is not authorized');
          return true; // SHOULD RETURN FALSE HERE WILL CHANGE LATER
        }

        // Otherwise, redirect based on role
        console.log('User is authorized');
        console.log(user);
        return true;
      })
    );
  }
}
