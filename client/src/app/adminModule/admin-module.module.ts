import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersChartComponent } from './adminUsersChart/admin-users-chart.component';
import { AdminExpiredPasswordReportComponent } from './adminExpiredPasswordReport/admin-expired-password-report.component';
import { AdminDashboardComponent } from './adminDashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUserApplicationsComponent } from './admin-user-applications/admin-user-applications.component';
import { MatIcon } from '@angular/material/icon';
import { AdminAppFormComponent } from './admin-app-form/admin-app-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminExpiredPasswordReportComponent,
    AdminDashboardComponent,
    AdminUsersChartComponent,
    AdminUserApplicationsComponent,
    AdminAppFormComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
