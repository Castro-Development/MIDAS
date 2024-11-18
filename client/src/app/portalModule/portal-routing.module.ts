import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChartOfAccountsComponent } from "./chartOfAccount/feature/chart-of-accounts.component";
import { JournalEntryFormComponent } from "./journalEntry/entryForm/journal-entry-form.component";
import { PortalDashboardComponent } from "./portalDashboard/portal-dashboard.component";
import { AuthGuardService } from "../shared/authGuard/auth-guard.service";
import { JournalEntryReviewComponent } from "./journalEntry/entryReview/journal-entry-review.component";
import { AccountLedgerComponent } from "./accountLedger/feature/account-ledger.component";
import { AccountEventLogComponent } from "./accountEventLog/feature/account-event-log.component";
import { JournalSubmissionComponent } from "./journalEntry/entrySubmissionReview/journal-submission.component";
import { FiscalPeriodManagementComponent } from "./fiscalPeriod/fiscal-period-management.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'portal-dashboard',
    },
    {
        path: 'event-log',
        component: AccountEventLogComponent
    },
    {
        path: 'account-ledger/:accountNumber',
        component: AccountLedgerComponent
    },
    {
        path: 'chart-of-accounts',
        component: ChartOfAccountsComponent
    },
    {
        path: 'journal-entry-form',
        component: JournalEntryFormComponent
    },
    {
        path: 'journal-entry-review',
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
        path: 'general-ledger-functions',
        loadChildren: () => import('./adminGeneralLedgerFunctions/admin-general-ledger-functions.module').then(m => m.AdminGeneralLedgerFunctionsModule)
    },
    // {
    //     path: 'journal-entry:postRef',
    //     component: JournalSubmissionComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PortalRoutingModule {}