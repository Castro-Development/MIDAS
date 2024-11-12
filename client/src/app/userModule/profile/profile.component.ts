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
import { UserService } from '../../shared/userService/data-access/user.service';
import { Auth, getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  public userService = inject(UserService);

  public userRole$ = this.userService.viewRole$;
  public userPhone$ = this.userService.viewPhone$;
  public userName$ = this.userService.username$;

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

  // Actually calling the placeInProfile method once we obtain an image. placeInProfile is
  // unimplemented as instructed, this is simply calling a function that does nothing.
  //
  // You should just be able to replace whatever is getting the profile image for our users
  // with wherever you wanna store these pictures in the DB. Maybe a helper method to get
  // profile pictures would be useful?
  uploadProfileImage(): void {
    // Makes sure there is a selected file
    if (this.selectedFile) {

      // This method call is kind of upset I think because the actual placeInProfile method
      // is nothing. Once you wire that up, this should work I think?
      this.userService.uploadProfilePicture(this.userService.getCurrentUser().id, this.selectedFile).then();
    }
    else {
      console.warn('No file selected');
    }
  }


  public refreshUser() {
    console.log(this.userService.userProfile$);
  }


}

