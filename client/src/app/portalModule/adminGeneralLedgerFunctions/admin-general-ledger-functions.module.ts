import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCreationCard } from './adminAccountCreate/ui/admin-account-creation.card';
import { AccountCreationComponent } from './adminAccountCreate/feature/admin-account-creation.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AccountCreationComponent,
    AccountCreationCard,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
  ]
})
export class AdminGeneralLedgerFunctionsModule { }
