import { Component } from '@angular/core';
import { Router } from 'express';
import { inject } from '@angular/core';
import { UserService } from '../../../shared/userService/data-access/user.service';
import { async } from 'rxjs';
@Component({
  selector: 'router-outlet',
  templateUrl: './splash-screen-component.component.html',
  styleUrl: './splash-screen-component.component.scss'
})
export class SplashScreenComponent {
  public userService = inject(UserService);
  constructor() {
    
  }
}
