import { Component, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../states/auth-state.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

  public authState = inject(AuthStateService);
  router: any;
  readonly isAdmin$ = this.authState.isAdmin$;

  constructor(router: Router) { this.router = router; console.log(this.isAdmin$)}

  
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
