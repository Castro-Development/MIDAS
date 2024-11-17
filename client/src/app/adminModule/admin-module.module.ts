import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersChartComponent } from './adminUsersChart/admin-users-chart.component';
import { AdminExpiredPasswordReportComponent } from './adminExpiredPasswordReport/admin-expired-password-report.component';
import { AdminDashboardComponent } from './adminDashboard/admin-dashboard.component'; 
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUserApplicationsComponent } from './admin-user-applications/admin-user-applications.component';
import { AdminUserApplicationReviewComponent } from './adminUserApplicationReview/admin-user-application-review.component';

@NgModule({
  declarations: [
    AdminExpiredPasswordReportComponent,
    AdminDashboardComponent,
    AdminUsersChartComponent,
    AdminUserApplicationsComponent,
    AdminUserApplicationReviewComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
