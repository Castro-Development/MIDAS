import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-admin-app-form',
  templateUrl: './admin-app-form.component.html',
  styleUrl: './admin-app-form.component.scss'
})
export class AdminAppFormComponent implements OnInit{

  user!: UserApplicationWithMetaData;
  userAdminFacade = inject(UserAdminFacade);
  authState = inject(AuthStateService);
  userProfileState = inject(UserProfileStateService);

  approveDetails!: ApprovalDetails;
  rejectDetails!: RejectionDetails;


  @Output() formSubmit = new EventEmitter<any>();
  applicationForm!: FormGroup;

  userFirestoreService = inject(UserFirestoreService);
  //admin = inject(UserSecurityFacade);
  admin = this.userProfileState.activeProfile$;
  // reviewer!: User;
  // reviewer2!: UserModel;
  // reviewer3!:string;


  constructor(private route: ActivatedRoute, private fb: FormBuilder){


  }


  public createForm() {
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
      chosenRole: ['', Validators.required],
      reviewedBy: ['', Validators.required],

    });

  }

  canSubmit(): boolean {
    return (
      true
    );
  }

  ngOnInit() {


    // firstValueFrom(this.authState.user$).then((user)=>{
    //   if(user != null){
    //     return user.uid;
    //   }
    //   else return
    // }).then( (userId) => {
    //       return firstValueFrom(this.userFirestoreService.getUserObservable(userId))
    // })



    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.user = JSON.parse(params['data']);
      }
    });
    this.createForm();
  }

  onSubmit() {
    // if (this.applicationForm.valid) {
    //   const formValue = this.journalEntryForm.value as JournalEntryFormValue;

    //   const accountsFromTransactions = formValue.transactions.map((transaction: JournalTransaction) => transaction.accountId);

    //   // Prepare the journal entry object
    //   const journalEntry = {
    //     id: '',
    //     postReference: '',
    //     updatedBy: '',
    //     totalDebits: this.calculateTotalDebits(),
    //     totalCredits: this.calculateTotalCredits(),
    //     isBalanced: true,
    //     status: JournalEntryStatus.DRAFT,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     date: new Date(formValue.date),
    //     description: formValue.description,
    //     version: 1,
    //     versionHistory: [],
    //     createdBy: getAuth().currentUser?.uid || '',
    //     // Fixed: using formValue.transactions instead of transaction
    //     accounts: accountsFromTransactions,
    //     transactions: formValue.transactions.map((transaction: JournalTransaction) => ({
    //       id: crypto.randomUUID(), // Add unique ID for each transaction
    //       journalEntryId: '', // This will be set when the entry is saved
    //       accountId: transaction.accountId,
    //       description: transaction.description,
    //       debitAmount: Number(transaction.debitAmount) || 0,
    //       creditAmount: Number(transaction.creditAmount) || 0,
    //       createdAt: new Date(),
    //       createdBy: getAuth().currentUser?.uid || '',
    //       updatedAt: new Date(),
    //       updatedBy: getAuth().currentUser?.uid || ''
    //     }))
    //   } as JournalEntry;

    //   console.log(journalEntry);
    //   this.formSubmit.emit(journalEntry);
    // }

  }

  accept(applicationId: string, role: UserRole, reason: string){
    this.approveDetails.reviewerId  = "";
    this.approveDetails.notes  = "";
    this.approveDetails.assignedRole  = role;

    this.userAdminFacade.approveApplication(applicationId, this.approveDetails);


  }


}
