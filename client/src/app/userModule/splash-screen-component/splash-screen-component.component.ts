import { Component } from '@angular/core';
import { Router } from 'express';
import { inject } from '@angular/core';
import { async } from 'rxjs';
import { AuthStateService } from '../../shared/states/auth-state.service';
@Component({
  selector: 'app-splash',
  templateUrl: './splash-screen-component.component.html',
  styleUrl: './splash-screen-component.component.scss'
})
export class SplashScreenComponent {
  authState = inject(AuthStateService)
  constructor() {

  }
}
