import { Component, inject } from '@angular/core';
import { Router,  } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators,  } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserRole } from '../../shared/dataModels/userModels/userRole.model';
import { UserAdminFacade } from '../../shared/user/admin/user-administration.facade';
import { UserSecurityFacade } from '../../shared/user/auth/user-security.facade';
import { UserProfileFacade } from '../../shared/user/profile/user-profile.facade';


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
  userData !: any;
  showAdd!: boolean;
  showEdit!: boolean;
  currentId: string = '';
  
  
  errorSubject = new BehaviorSubject<string | null>(null);



  constructor(
    private adminFacade: UserAdminFacade,
    private securityFacade: UserSecurityFacade,
    private router: Router,
    private userProfile: UserProfileFacade,
    private auth: Auth,
  ) {
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
  

    const userName = this.adminFacade.generateUsername(this.formValue.value.firstname, this.formValue.value.lastname, new Date());
    this.securityFacade.requestSystemAccess({
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
      },
    }).then(() => {

    })
    //Make a dialog box pop up for 5-10 seconds that says "Your application has been submitted. You will receive an email when your account has been approved. Your username is: ..."
    
  }


}



// Creates User Object
