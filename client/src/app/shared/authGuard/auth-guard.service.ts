// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UserService } from '../userService/data-access/user.service';
import { UserRole } from '../dataModels/userModels/userRole.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate() {
    return this.userService.userProfile$.pipe(
      take(1),
      map(user => {
        // If no user or role is guest, allow access
        if (!user || user.role === UserRole.Guest) {
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
