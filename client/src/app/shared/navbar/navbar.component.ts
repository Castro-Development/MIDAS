import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../../userModule/login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserModel } from '../dataModels/userModels/user.model';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { UserService } from '../userService/data-access/user.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{

  public userService = inject(UserService);
  router: any;
  readonly isAdmin$ = this.userService.isAdmin$;

  constructor(router: Router) { this.router = router; console.log(this.isAdmin$)}

  
  logout() {
    this.userService.logout();
    console.log(this.userService.isLoggedIn$)
    this.router.navigate(['/login']);
  }



}
