import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AccountLedger, JournalEntry, JournalEntryStatus, JournalTransaction } from '../../shared/dataModels/financialModels/account-ledger.model';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { User } from "firebase/auth";
import { UserAdminFacade } from '../../shared/user/admin/user-administration.facade';
import { ApprovalDetails } from '../../shared/dataModels/userModels/user.model';
import { RejectionDetails } from '../../shared/dataModels/userModels/user.model';
import { UserRole } from '../../shared/dataModels/userModels/userRole.model';
import { UserSecurityFacade } from '../../shared/user/auth/user-security.facade';
import { firstValueFrom } from 'rxjs';
import { UserFirestoreService } from '../../shared/user/user-firestore.service';
import { UserProfileStateService } from '../../shared/user/profile/user-profile-state.service';
import { NotificationFilter } from '../../shared/notification/notification-state.service';

@Component({
  selector: 'app-admin-app-form',
  templateUrl: './admin-app-form.component.html',
  styleUrl: './admin-app-form.component.scss'
})
export class AdminAppFormComponent implements OnInit{

  user!: UserApplication;
  currentAdmin!: UserModel;
  userAdminFacade = inject(UserAdminFacade);
  userProfileState = inject(UserProfileStateService);
  userFirestore = inject(UserFirestoreService);
  router = inject(Router);

  fb = inject(FormBuilder);
  applicationForm!: FormGroup;
  route = inject(ActivatedRoute);

  approveDetails!: ApprovalDetails;
  rejectDetails!: RejectionDetails;

  @Output() formSubmit = new EventEmitter<any>();



  constructor(){


  }


  public createForm() {
    this.userProfileState.activeProfile$.subscribe((admin) => {
      this.currentAdmin = admin;
      this.applicationForm = this.fb.group({
        userId: [this.user.id, Validators.required],
        username: [this.user.username, Validators.required],
        firstname: [this.user.firstname, Validators.required],
        lastname: [this.user.lastname, Validators.required],
        phone: [this.user.phone, Validators.required],
        street: [this.user.street, Validators.required],
        zip: [this.user.zip, Validators.required],
        state: [this.user.state, Validators.required],
        password: [this.user.password, Validators.required],
        role: [this.user.requestedRole, Validators.required],
        dateRequested: [this.user.dateRequested, Validators.required],
        status: ['', Validators.required],
        dateUpdated: [new Date().toISOString().split('T')[0], Validators.required],
        //dateApproved: [new Date().toISOString().split('T')[0], Validators.required],
        reason: ['', Validators.required],
        //reviewedBy: [this.user.reviewedBy, Validators.required],
        chosenRole: [0, Validators.required],
        reviewedBy: [this.currentAdmin.username, Validators.required],
      });
    });


  }

  canSubmit(): boolean {
    return (
      true
    );
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.user = JSON.parse(params['data']);
      }
    });

    this.createForm();
  }

  onAccept() {
    //console.log(this.applicationForm.value.reason);
    this.accept(this.user.id, this.applicationForm.value.chosenRole, this.applicationForm.value.reason);
    //this.securityFacade.requestSystemAccess(this.user);
    this.applicationForm.reset();
    console.log("On Accept compiled");
  }

  onReject() {

    this.reject(this.user.id, this.applicationForm.value.reason);
    this.applicationForm.reset();
    console.log("On reject compiled");
  }



  accept(applicationId: string, role: UserRole, reason: string){

    this.approveDetails = {
      reviewerId: this.currentAdmin.id,
      notes: reason,
      assignedRole: role,
    }
    console.log(this.approveDetails.reviewerId);
    this.userAdminFacade.approveApplication(applicationId, this.approveDetails);
  }

  reject(applicationId: string, reason: string){

    this.rejectDetails = {
      reviewerId: this.currentAdmin.id,
      notes: reason,
      reason: reason,
    }
    console.log(this.rejectDetails.reviewerId);
    this.userAdminFacade.rejectApplication(applicationId, this.rejectDetails);
  }

  createUser(){
    const tempN: NotificationFilter ={
      type: 'all',
      priority: 'all',
      category: 'all'
    }

    const temp: UserModel ={
      //id: this.user.id,
      // username: this.user.username,
      // firstname: this.user.firstname,
      // lastname: this.user.lastname,
      // phone: this.user.phone,
      // street: this.user.street,
      // zip: this.user.zip,
      // state: this.user.state,
      // password: this.user.password,
      id: this.user.id,
      username: this.user.username,
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      phone: this.user.phone,
      street: this.user.street,
      zip: this.user.zip,
      state: this.user.state,
      password: this.user.password,
      role: this.applicationForm.value.chosenRole,
      notificationFilter: tempN,
      numDenied: 0,
      dateApproved:new Date,
      lastPWUpdate: new Date,
    }

    this.userFirestore.createProfile(temp);
    console.log(temp);
    alert("User Creation Successful!");
    this.applicationForm.reset();
    this.router.navigate(['/admin-user-applications']);

  }

}
