// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../dataModels/userModels/userRole.model';
import { AuthStateService } from '../user/auth/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private router: Router,
    private authState: AuthStateService
  ) {}

  canActivate() {
    return this.authState.userProfile$.pipe(
      take(1),
      map(user => {
        console.log('Checking user authorization', user);
        // If no user or role is guest, allow access
        if (!user || user.role > 2) {
          console.log('User is not authorized');
          return false;
        }

        // Otherwise, redirect based on role
        console.log('User is authorized');
        console.log(user);
        return true;
      })
    );
  }
}
