import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthGuardService } from './shared/authGuard/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./userModule/user-module.module').then(m => m.UserModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./adminModule/admin-module.module').then(m => m.AdminModule),
  },
  {
    path: 'portal',
    loadChildren: () => import('./portalModule/portal-module.module').then(m => m.PortalModule),
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
