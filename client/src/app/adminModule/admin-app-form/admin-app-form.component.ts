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
import { NotificationFilter } from '../../shared/dataModels/messageModel/message.model';
import { Timestamp } from '@angular/fire/firestore';
import { CommonService } from '../../shared/common.service';
import { CommonModule, formatDate } from '@angular/common';
import { UserAdminFirestoreService } from '../../shared/user/admin/user-admin-firestore.service';

@Component({
  selector: 'app-admin-app-form',
  templateUrl: './admin-app-form.component.html',
  styleUrl: './admin-app-form.component.scss'
})

export class AdminAppFormComponent implements OnInit{

  public common = inject(CommonService); // contains date manipulation methods

  user!: UserApplication;
  currentAdmin!: UserModel;
  userAdminFacade = inject(UserAdminFacade);
  userAdminFirestoreService = inject(UserAdminFirestoreService);
  userProfileState = inject(UserProfileStateService);
  userFirestore = inject(UserFirestoreService);
  router = inject(Router);

  fb = inject(FormBuilder);
  applicationForm!: FormGroup;
  route = inject(ActivatedRoute);

  approveDetails!: ApprovalDetails;
  rejectDetails!: RejectionDetails;

  tempUser!: UserApplication;


  @Output() formSubmit = new EventEmitter<any>();



  constructor(){


  }


  public createForm() {
    // this.tempUser = {
    //   id: this.user.id,
    //   username: this.user.username,
    //   firstname: this.user.firstname,
    //   lastname: this.user.lastname,
    //   phone: this.user.phone,
    //   street: this.user.street,
    //   zip: this.user.zip,
    //   state: this.user.state,
    //   password: this.user.password,
    //   requestedRole: this.user.requestedRole,
    //   dateRequested: this.user.dateRequested,
    //   status: this.user.status,

    //   //numDenied: this.user.numDenied,
    //   //dateApproved: this.user.dateApproved,
    //   //assignedGL: this.user.assignedGL,
    //   //assignedAccounts: this.user.assignedAccounts,
    //   role: this.user.role,
    //   notificationFilter: this.user.notificationFilter,
    //   lastPWUpdate: new Date,
    // }


    this.userProfileState.activeProfile$.subscribe((admin) => {
      this.currentAdmin = admin;
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
        requestedRole: [this.user.requestedRole, ],
        //dateRequested: [this.user.dateRequested, ],
        status: ['', ],
        //dateUpdated: [new Date().toISOString().split('T')[0], ],
        //dateApproved: [new Date().toISOString().split('T')[0], Validators.required],
        reason: ['', Validators.required],
        //reviewedBy: [this.user.reviewedBy, Validators.required],
        chosenRole: [0, Validators.required],
        reviewedBy: [this.currentAdmin.username,],
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
    this.accept(this.user.id, this.applicationForm.value.chosenRole, this.applicationForm.value.reason);
    //this.securityFacade.requestSystemAccess(this.user);

    console.log("On Accept compiled");
    alert(this.user.username +" has been accepted! Navigating back to applications");
    this.router.navigate(['/admin-user-applications']);

  }

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

  onReject() {

    this.reject(this.user.id, this.applicationForm.value.reason);

    console.log("On reject compiled");
    alert(this.user.username +" has been rejected. Navigating back to applications");
    this.applicationForm.reset();
    this.router.navigate(['/admin-user-applications']);
  }



  private accept(applicationId: string, role: UserRole, reason: string){

    this.approveDetails = {
      reviewerId: this.currentAdmin.id,
      notes: reason,
      assignedRole: role,
    }
    //this.user.role = this.applicationForm.value.

    console.log(this.approveDetails.reviewerId);
    this.userAdminFacade.approveApplication(this.user, this.approveDetails);
  }

  private reject(applicationId: string, reason: string){

    this.rejectDetails = {
      reviewerId: this.currentAdmin.id,
      notes: reason,
      reason: reason,
    }
    console.log(this.rejectDetails.reviewerId);
    this.userAdminFacade.rejectApplication(applicationId, this.rejectDetails);
  }

  updateApp(){

    this.user = Object.assign(this.user, this.applicationForm.value);
    this.userAdminFirestoreService.updateApplication(this.user);
    alert(this.user.username +" has been updated. Navigating back to applications");
    //this.applicationForm.reset();
    this.router.navigate(['/admin-user-applications']);
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
      dateApproved: new Date(),
      lastPWUpdate: new Date(),
    }

    this.userFirestore.createProfile(temp);
    console.log(temp);
    alert("User Creation Successful!");
    this.applicationForm.reset();
    this.router.navigate(['/admin-user-applications']);

  }

  convertDate(date: Date | undefined){
    //let latest_date = this.datepipe.transform(date, 'MMMM dd, yyyy');
    if(date != undefined){
      let latest_date = formatDate(date,'MM/dd/yyyy', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }

}
