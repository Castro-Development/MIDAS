import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { UserProfileFacade } from '../../shared/user/profile/user-profile.facade';
import { UserRole } from '../../shared/dataModels/userModels/userRole.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

  public profileFacade = inject(UserProfileFacade);
  public authState = inject(AuthStateService);

  readonly isAdmin$ = this.profileFacade.userProfile$.pipe(
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
