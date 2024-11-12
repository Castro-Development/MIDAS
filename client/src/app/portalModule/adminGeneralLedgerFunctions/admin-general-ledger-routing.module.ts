
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountCreationComponent } from './adminAccountCreate/feature/admin-account-creation.component';

const routes: Routes = [
  {
    path: 'account-add',
    component: AccountCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminGLFuncsRoutingModule { }