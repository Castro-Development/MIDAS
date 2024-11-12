import { Component, inject } from '@angular/core';
import { Router,  } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators,  } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserService } from '../../shared/userService/data-access/user.service';
import { UserRole } from '../../shared/dataModels/userModels/userRole.model';


@Component({
  selector: 'app-register',
  templateUrl: './request-system-access.component.html',
  styleUrl: './request-system-access.component.scss'
})
export class RequestSystemAccessComponent {


  passwordHide = true;
  confirmPasswordHide = true;
  mismatch = false;



  formValue !: FormGroup;
  userService = inject(UserService);
  userData !: any;
  showAdd!: boolean;
  showEdit!: boolean;
  currentId: string = '';
  
  
  errorSubject = new BehaviorSubject<string | null>(null);



  constructor(private formbuilder: FormBuilder, private router: Router, private auth: Auth) {
    this.formValue = new FormGroup({
      username: new FormControl("",),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl("", [Validators.required],),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      phone: new FormControl("",),
      street: new FormControl("",),
      zip: new FormControl("",),
      state: new FormControl("",),
      role: new FormControl(UserRole,),
    },)
  }



  submitApplication() {
    
    this.errorSubject.next(null);
    
    this.userService.application({
      id: this.currentId,
      username: '',
      firstname: this.formValue.value.firstname,
      lastname: this.formValue.value.lastname,
      phone: this.formValue.value.phone,
      street: this.formValue.value.street,
      zip: this.formValue.value.zip,
      state: this.formValue.value.state,
      password: this.formValue.value.password,
      requestedRole: this.formValue.value.role,
      role: UserRole.Guest,
      status: 'pending',
      dateRequested: new Date(),
      notificationFilter: {
        'category': 'all',
        'priority': 'all',
        'type': 'all'
      }
      
    }).then(() => {
      console.log('User created successfully');
    }).catch((error) => {
      console.error('User creation failed:', error);
      this.errorSubject.next(this.getErrorMessage(error));
    })


    //Make a dialog box pop up for 5-10 seconds that says "Your application has been submitted. You will receive an email when your account has been approved. Your username is: ..."
    
  }

  private getErrorMessage(error: any): string {
    if (error?.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'This email is already registered';
        case 'auth/invalid-email':
          return 'Invalid email address';
        case 'auth/operation-not-allowed':
          return 'Registration is currently disabled';
        case 'auth/weak-password':
          return 'Password is too weak';
        default:
          return 'An unexpected error occurred';
      }
    }
    return error?.message || 'An unexpected error occurred';
  }


}



// Creates User Object
