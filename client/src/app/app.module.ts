import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { map } from 'rxjs/operators';


import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient, provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { CalendarModule } from './userModule/calendar/calendar.module';
import { UserModule } from './userModule/user-module.module';
import { AdminModule } from './adminModule/admin-module.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NavbarModule } from './shared/navbar/navbar.module';
import { ErrorHandlingService } from './shared/services/error-handling.service';
import { getStorage, provideStorage } from '@angular/fire/storage';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatFormField,
    UserModule,
    AdminModule,
    
    


  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({"projectId":"midas-app-239bc","appId":"1:880947371935:web:1e02db79c3e04b0be567aa","storageBucket":"midas-app-239bc.appspot.com","apiKey":"AIzaSyBefPwnb0z3xR2KZrgQ11pLVaK4guxiwp8","authDomain":"midas-app-239bc.firebaseapp.com","messagingSenderId":"880947371935"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    ErrorHandlingService,
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
