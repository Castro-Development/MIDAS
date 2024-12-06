import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AccountLedger, JournalEntry, JournalEntryStatus, JournalTransaction } from '../../shared/dataModels/financialModels/account-ledger.model';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { User } from "firebase/auth";
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-edit-user',
  templateUrl: './admin-edit-user.component.html',
  styleUrl: './admin-edit-user.component.scss'
})
export class AdminEditUserComponent  implements OnInit{

  user!: UserModel;
  @Output() formSubmit = new EventEmitter<any>();
  applicationForm!: FormGroup;
  authState = inject(AuthStateService);
  tempUser!: UserModel;
  oldPass!: string;
  router = inject(Router);

  userFirestoreService = inject(UserFirestoreService);



  constructor(private route: ActivatedRoute, private fb: FormBuilder){

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.user = JSON.parse(params['data']);
        this.oldPass = this.user.password;
      }
    });

    this.createForm();
    this.updateTemp();


  }

  public createForm() {
    this.applicationForm = this.fb.group({
      id: [this.user.id, Validators.required],
      username: [this.user.username, Validators.required],
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      phone: [this.user.phone, Validators.required],
      street: [this.user.street, Validators.required],
      zip: [this.user.zip, Validators.required],
      state: [this.user.state, Validators.required],
      password: [this.user.password, Validators.required],
      role: [this.user.role, Validators.required],
      numDenied: [this.user.numDenied || '0', Validators.required],
      lastPWUpdate: [new Date().toISOString().split('T')[0], Validators.required],
      //lastPWUpdate: [this.user.lastPWUpdate || new Date().toISOString().split('T')[0], Validators.required],

      dateUpdated: [new Date().toISOString().split('T')[0], Validators.required],
    });

  }

  // initialize temp model with user data
  updateTemp(){
    this.tempUser = {
      id: this.user.id,
      username: this.user.username,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      phone: this.user.phone,
      street: this.user.street,
      zip: this.user.zip,
      state: this.user.state,
      password: this.user.password,
      //numDenied: this.user.numDenied,
      //dateApproved: this.user.dateApproved,
      //assignedGL: this.user.assignedGL,
      //assignedAccounts: this.user.assignedAccounts,
      role: this.user.role,
      notificationFilter: this.user.notificationFilter,
      //lastPWUpdate: this.user.lastPWUpdate,
    }
  }

  onSubmit() {
    if (this.applicationForm.invalid) {
      return;
    }
    // check if password was changed.
    if(this.oldPass != this.applicationForm.value.password){
      this.tempUser.lastPWUpdate = new Date;
    }

    this.tempUser = Object.assign(this.tempUser, this.applicationForm.value);
    this.userFirestoreService.updateProfile(this.tempUser);

    alert("User successfully updated!");
    this.router.navigate(['/admin-users-chart']);

  }

}
