import { NgModule } from "@angular/core";
import { Routes, RouterModule, withDebugTracing } from "@angular/router";
import { ChartOfAccountsComponent } from "./chartOfAccount/chart-of-accounts.component";
import { AuthGuardService } from "../shared/authGuard/auth-guard.service";
import { JournalEntryFormComponent } from "./journalEntry/journalEntryForm/journal-entry-form.component";
import { JournalEntryReviewComponent } from "./journalEntry/journalEntryReview/journal-entry-review.component";
import { PortalDashboardComponent } from "./portalDashboard/portal-dashboard.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'portal-dashboard',
    },
    // {not yet implemented
    //     path: 'event-log',
    //     component: AccountEventLogComponent
    // },
    // {not yet implemented
    //     path: 'account-ledger',
    //     component: AccountLedgerComponent
    // },
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PortalRoutingModule {}