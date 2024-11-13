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
import { AuthStateService } from '../../shared/states/auth-state.service';
import { UserProfileFacade } from '../../shared/facades/userFacades/user-profile.facade';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  public authState = inject(AuthStateService);

  public userRole$ = this.authState.viewRole$;
  public userPhone$ = this.authState.viewPhone$;
  public userName$ = this.authState.username$;

  constructor(private router: Router, private profileFacade: UserProfileFacade) { }

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

  // Actually calling the placeInProfile method once we obtain an image. placeInProfile is
  // unimplemented as instructed, this is simply calling a function that does nothing.
  //
  // You should just be able to replace whatever is getting the profile image for our users
  // with wherever you wanna store these pictures in the DB. Maybe a helper method to get
  // profile pictures would be useful?
  uploadProfileImage(): void {
    const uid = this.authState.getUid$;
    uid.subscribe((uid) => {
      if(uid && this.selectedFile){
        this.profileFacade.uploadProfilePicture(this.authState.getUid$, this.selectedFile);
      } else if(!this.selectedFile){
        console.warn('No file selected');
      } else if(!uid){
        console.warn('No user ID found');
      } else{
        console.warn('Unknown error - Profile Picture not uploaded');
      }
    });
  }


  public refreshUser() {
    console.log(this.authState.userProfile$);
  }


}

