import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserModel } from '../../shared/dataModels/userModels/user.model';
import { Auth, getAuth } from '@angular/fire/auth';
import { UserProfileFacade } from '../../shared/user/profile/user-profile.facade';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {

  userProfile = inject(UserProfileFacade);

  readonly username$ = this.userProfile.userProfileState.username$;
  readonly activeRole$ = this.userProfile.userProfileState.activeRole$;
  readonly viewPhone$ = this.userProfile.userProfileState.viewPhone$;

  constructor(private router: Router, private auth: Auth) { }

  // Stores the user's profile image
  selectedFile: File | null = null;

  // Event to handle user selecting the image file
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    // Ensures a file was selected and stores it
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  uploadProfileImage(): void {
    // Makes sure there is a selected file
    if (this.selectedFile) {

      this.userProfile.uploadProfileImage(this.selectedFile);
    }
    else {
      console.warn('No file selected');
    }
  }




}

