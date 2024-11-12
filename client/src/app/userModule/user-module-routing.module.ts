import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CalendarComponent } from "./calendar/calendar.component";
import { ForgotPasswordComponent } from "./forgotPassword/forgot-password.component";
import { InboxComponent } from "./inbox/inbox.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { RequestSystemAccessComponent } from "./requestSystemAccess/request-system-access.component";
import { SplashScreenComponent } from "./shared/splash-screen-component/splash-screen-component.component";
import { AuthGuardService } from "../shared/authGuard/auth-guard.service";

const routes: Routes = [
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
        path: 'home',
        component: SplashScreenComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserModuleRoutingModule {}