import { Component } from '@angular/core';
import { Router } from 'express';
import { inject } from '@angular/core';
import { async } from 'rxjs';
import { UserProfileFacade } from '../../shared/user/profile/user-profile.facade';
@Component({
  selector: 'router-outlet',
  templateUrl: './splash-screen-component.component.html',
  styleUrl: './splash-screen-component.component.scss'
})
export class SplashScreenComponent {
  userProfile = inject(UserProfileFacade);
  constructor() {
    
  }
}
