import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from '../../app-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbar,
    RouterLink,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatInputModule,
    AppRoutingModule
  ]
})
export class NavbarModule { }
