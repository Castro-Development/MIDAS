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
  template: `
  <div class="flex items-center p-10" style="background-color:#242525; color:white;">
  <button routerLink="/" class=" border-black mx-auto rounded-md disabled:bg-amber-400 py-2 px-3 mt-3 bg-amber-600 text-white font-bold">
    Return to Users
    </button>
</div>
<div class="flex" style="background-color:#242525; color:white;" >
  <div class="container mx-auto my-0 p-8 shadow-md rounded-md max-w-md" style="background-color:#1b1c1f; color: white; max-width:600px">
    <h1 class="text-3xl text-gray-100 font-bold mb-4 text-center">
      {{userProfile.userProfileState.username$ | async}}'s User Profile 
    </h1>
    <div>
      <div class="text-center">
        <!-- <div
          class="rounded-full bg-blue-500 my-4 text-4xl w-24 h-24 inline-flex items-center justify-center font-bold text-white">
          {{user.fullName[0] | uppercase}}
        </div> -->

        <img src="../../../assets/Male Icon.png" class="py-10" style="max-width: 300px; margin:auto">
      </div>

      <button type="submit" class="w-full mt-4 border rounded-md border-black disabled:bg-amber-400 py-2 px-3 my-5 bg-amber-600 text-white font-bold">
      Update Profile Image
      </button>

      <hr class="py-4 border-gray-100">
      <div class="grid grid-cols-2 gap-4">
        <div class="text-gray-100 font-bold">Full Name</div>
        <div class="text-gray-300 font-medium">{{userProfile.userProfileState.username$ | async}} </div> <!-- Damien: erased " | titlecase" from the two properties on this line -->
<!-- 
        <div class="text-gray-100 font-bold">Email</div>
        <div class="text-gray-300 font-medium">{{profileDetail.email}}</div> Damien: Commented as we don't need email-->

        <div class="text-gray-200 font-bold">
          Role
        </div>

        <div class="text-gray-300 font-medium">{{userProfile.userProfileState.activeRole$ | async}}</div>
        <div class="text-gray-100 font-bold">
          Phone
        </div>
        <div class="text-gray-300 font-medium">{{userProfile.userProfileState.viewPhone$ | async}}</div>

      </div>
    </div>
  </div>
</div>

`,
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

