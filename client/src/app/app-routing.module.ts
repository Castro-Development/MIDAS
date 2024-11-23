import { NgModule } from '@angular/core';
import { RouterModule, Routes, withDebugTracing } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthGuardService } from './shared/authGuard/auth-guard.service';
import { AdminAppFormComponent } from './adminModule/admin-app-form/admin-app-form.component';
import { AdminEditUserComponent } from './adminModule/admin-edit-user/admin-edit-user.component';
import { AdminUserApplicationsComponent } from './adminModule/admin-user-applications/admin-user-applications.component';
import { AdminDashboardComponent } from './adminModule/adminDashboard/admin-dashboard.component';
import { AdminExpiredPasswordReportComponent } from './adminModule/adminExpiredPasswordReport/admin-expired-password-report.component';
import { AdminUsersChartComponent } from './adminModule/adminUsersChart/admin-users-chart.component';
import { AccountEventLogComponent } from './portalModule/accountEventLog/account-event-log.component';
import { AccountLedgerComponent } from './portalModule/accountLedger/account-ledger.component';
import { AccountCreationComponent } from './portalModule/adminGeneralLedgerFunctions/adminAccountCreate/admin-account-creation.component';
import { ChartOfAccountsComponent } from './portalModule/chartOfAccount/chart-of-accounts.component';
import { FiscalPeriodManagementComponent } from './portalModule/fiscalPeriod/fiscal-period-management.component';
import { JournalEntryFormComponent } from './portalModule/journalEntry/entryForm/journal-entry-form.component';
import { JournalEntryReviewComponent } from './portalModule/journalEntry/entryReview/journal-entry-review.component';
import { PortalDashboardComponent } from './portalModule/portalDashboard/portal-dashboard.component';
import { CalendarComponent } from './userModule/calendar/calendar.component';
import { ForgotPasswordComponent } from './userModule/forgotPassword/forgot-password.component';
import { InboxComponent } from './userModule/inbox/inbox.component';
import { LoginComponent } from './userModule/login/login.component';
import { ProfileComponent } from './userModule/profile/profile.component';
import { RequestSystemAccessComponent } from './userModule/requestSystemAccess/request-system-access.component';
import { SplashScreenComponent } from './userModule/splash-screen-component/splash-screen-component.component';
import { MessagingComponent } from './userModule/messaging/messaging.component';

export const routes: Routes = [

  // User Module
  {
    path: '',
    component: SplashScreenComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
      path: 'forgot-password',
      component: ForgotPasswordComponent
  },
  {
      path: 'inbox',
      component: InboxComponent
  },
  {
      path: 'login',
      component: LoginComponent
  },
  {
      path: 'profile',
      component: ProfileComponent
  },
  {
      path: 'request-system-access',
      component: RequestSystemAccessComponent
  },
  {
    path: 'messaging',
    component: MessagingComponent
},

  // {
  //     path: '',
  //     pathMatch: 'full',
  //     redirectTo: 'home',
  // },

  // Admin Module
  // {
    // path: 'admin',
    // pathMatch: 'full',
    // redirectTo: 'admin-dashboard',
  // },
  {
    path: 'admin-users-chart',
    canActivate: [AuthGuardService],
    component: AdminUsersChartComponent,
  },
  {
    path: 'admin-expired-passwords-report',
    canActivate: [AuthGuardService],
    component: AdminExpiredPasswordReportComponent,
  },
  {
    path: 'admin-dashboard',
    canActivate: [AuthGuardService],
    component: AdminDashboardComponent,
  },
  {
    path: 'admin-user-applications',
    canActivate: [AuthGuardService],
    component: AdminUserApplicationsComponent,
  },
  {
    path: 'admin-app-form',
    canActivate: [AuthGuardService],
    component: AdminAppFormComponent,
  },
  {
    path: 'admin-edit-user',
    //canActivate: [AuthGuardService],
    component: AdminEditUserComponent,
  },

  // portal Module

  // {
  //   path: 'portal',
  //   pathMatch: 'full',
  //   redirectTo: 'portal-dashboard',
  // },
  {
      path: 'event-log',
      canActivate: [AuthGuardService],
      component: AccountEventLogComponent
  },
  {
      path: 'account-ledger/:accountNumber',
      canActivate: [AuthGuardService],
      component: AccountLedgerComponent
  },
  {
      path: 'chart-of-accounts',
      canActivate: [AuthGuardService],
      component: ChartOfAccountsComponent
  },
  {
      path: 'journal-entry-form',
      canActivate: [AuthGuardService],
      component: JournalEntryFormComponent
  },
  {
      path: 'journal-entry-review',
      canActivate: [AuthGuardService],
      component: JournalEntryReviewComponent
  },
  {
      path: 'fiscal-period',
      component: FiscalPeriodManagementComponent
  },
// {
//     path: 'journal-entry-review/:id',
//     component: JournalEntrySubmissionReviewComponent
// },
{
    path: 'portal-dashboard',
    canActivate: [AuthGuardService],
    component: PortalDashboardComponent
},
// {
//     path: 'business-gl-functions',
//     loadChildren: () => import('./adminBusinessGLFunctions/admin-business-glfunctions.module').then(m => m.AdminBusinessGLFunctionsModule)
// },
{
  path: 'add-account',
  component: AccountCreationComponent
}
// {
//     path: 'journal-entry:postRef',
//     component: JournalSubmissionComponent
// }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
