import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminUsersChartComponent } from "./adminUsersChart/admin-users-chart.component";
import { AdminExpiredPasswordReportComponent } from "./adminExpiredPasswordReport/admin-expired-password-report.component";
import { AuthGuardService } from "../shared/authGuard/auth-guard.service";
import { AdminDashboardComponent } from "./adminDashboard/admin-dashboard.component";
import { AdminUserApplicationsComponent } from "./admin-user-applications/admin-user-applications.component";
import { AdminAppFormComponent } from "./admin-app-form/admin-app-form.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin-dashboard',
  },
  {
    path: 'admin-users-chart',
    component: AdminUsersChartComponent,
  },
  {
    path: 'admin-expired-passwords-report',
    component: AdminExpiredPasswordReportComponent,
  },
  {
    path: 'admin-dashboard',
    canActivate: [AuthGuardService],
    component: AdminDashboardComponent,
  },
  {
    path: 'admin-user-applications',
    component: AdminUserApplicationsComponent,
  },
  {
    path: 'admin-app-form',
    component: AdminAppFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
