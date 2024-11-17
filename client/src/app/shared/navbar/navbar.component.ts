import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { UserRole } from '../dataModels/userModels/userRole.model';
import { AuthStateService } from '../user/auth/auth-state.service';
import { UserProfileFacade } from '../user/profile/user-profile.facade';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

  public userProfile = inject(UserProfileFacade);
  public authState = inject(AuthStateService);

  readonly isAdmin$ = this.userProfile.userProfileState.activeProfile$.pipe(
    map((profile) => profile?.role === UserRole.Administrator),
    distinctUntilChanged()
  );

  constructor(private router: Router) { }

  
  logout() {
    this.authState.logout();
    console.log(this.authState.isLoggedIn$)
    this.router.navigate(['/login']);
  }

  logUserStatus() {
    combineLatest([this.authState.userProfile$, this.authState.user$]).subscribe(([profile, user]) => {
      console.log(profile, user);
    });
  }



}