import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserApplicationWithMetaData, UserApplication, UserModel } from '../../shared/dataModels/userModels/user.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { AccountLedger, JournalEntry, JournalEntryStatus, JournalTransaction } from '../../shared/dataModels/financialModels/account-ledger.model';
import { AuthStateService } from '../../shared/user/auth/auth-state.service';
import { User } from "firebase/auth";

@Component({
  selector: 'app-admin-edit-user',
  templateUrl: './admin-edit-user.component.html',
  styleUrl: './admin-edit-user.component.scss'
})
export class AdminEditUserComponent  implements OnInit{

  user!: UserApplicationWithMetaData;
  @Output() formSubmit = new EventEmitter<any>();
  applicationForm!: FormGroup;
  authState = inject(AuthStateService);

  constructor(private route: ActivatedRoute, private fb: FormBuilder){

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.user = JSON.parse(params['data']);
      }
    });
    this.createForm();
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
    });

  }

  onSubmit() {}

}
