import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChartOfAccountsComponent } from "./chartOfAccount/feature/chart-of-accounts.component";
import { JournalEntryFormComponent } from "./journalEntry/entryForm/feature/journal-entry-form.component";
import { PortalDashboardComponent } from "./portalDashboard/portal-dashboard.component";
import { AuthGuardService } from "../shared/authGuard/auth-guard.service";
import { JournalEntryReviewComponent } from "./journalEntry/entryReview/feature/journal-entry-review.component";
import { AccountLedgerComponent } from "./accountLedger/feature/account-ledger.component";
import { AccountEventLogComponent } from "./accountEventLog/feature/account-event-log.component";

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PortalRoutingModule {}