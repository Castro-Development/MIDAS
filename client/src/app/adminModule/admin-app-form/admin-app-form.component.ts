import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AccountLedger, JournalEntry, JournalEntryStatus, JournalTransaction } from '../../shared/dataModels/financialModels/account-ledger.model';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { User } from "firebase/auth";

@Component({
  selector: 'app-admin-app-form',
  templateUrl: './admin-app-form.component.html',
  styleUrl: './admin-app-form.component.scss'
})
export class AdminAppFormComponent implements OnInit{

  user!: UserApplicationWithMetaData;
  @Output() formSubmit = new EventEmitter<any>();
  applicationForm!: FormGroup;
  authState = inject(AuthStateService);
  reviewer!: User;
  reviewer2!: UserModel;
  reviewer3!:string;


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
      reviewedBy: [this.reviewer3, Validators.required],

    });

  }

  canSubmit(): boolean {
    return (
      true
    );
  }

  ngOnInit() {
    //this.reviewer = this.authState.user$;
    this.authState.username$.subscribe(s => {
      if(s != null){
        //this.reviewer = s;
        //this.reviewer2 = s;
        this.reviewer3 = s;
      }
    })

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


}
