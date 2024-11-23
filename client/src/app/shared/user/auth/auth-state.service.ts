import { Injectable, inject } from "@angular/core";
import { Auth, authState, getAuth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { BehaviorSubject, map, distinctUntilChanged, catchError, Subject, Observable, of, from, switchMap, tap, filter } from "rxjs";
import { UserModel } from "../../dataModels/userModels/user.model";
import { ErrorHandlingService } from "../../error-handling/error-handling.service";
import { User as FirebaseUser, UserCredential } from 'firebase/auth';
import { SecurityStatus } from "./user-security.facade";
import { UserRole } from "../../dataModels/userModels/userRole.model";
import { UserProfileFacade } from "../profile/user-profile.facade";

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    lastActivity: Date | null;
    failedAttempts: number;
    lockoutUntil?: Date;
    user: FirebaseUser | null;
  }
  
  @Injectable({ providedIn: 'root' })
  export class AuthStateService {
    private readonly authStateSubject = new Subject<AuthState>();
    private userSecurityStatusSubject = new BehaviorSubject<SecurityStatus | null>(null);
    private stateErrorSubject = new BehaviorSubject<string | null>(null);
    private userProfileFacade = inject(UserProfileFacade)

    
    
    readonly authState$ = this.authStateSubject.asObservable();
    error$ = this.stateErrorSubject.asObservable();
    
    readonly userProfile$ = this.userProfileFacade.userProfile$;

    readonly userId$ = this.userProfile$.pipe(
      map(user => user?.id),
      distinctUntilChanged()
  );
    constructor(
        private errorHandlingService: ErrorHandlingService,
        private auth: Auth) {
        // Initialize auth state
        this.initAuthState();
        }


    initAuthState(){
        authState(this.auth).subscribe((user: FirebaseUser) => {
            
            if (user) {
              this.userProfileFacade.loginProfile(user.uid);
              user.getIdToken().then( token => {
                this.authStateSubject.next({
                    isLoggedIn: true,
                    token: token,
                    lastActivity: new Date(),
                    failedAttempts: 0,
                    user: user
                });
            });
            } else {
              this.authStateSubject.next({
                isLoggedIn: false,
                token: null,
                lastActivity: null,
                failedAttempts: 0,
                user: null
              });
            }
          });
    }

    
    readonly getUid$ = this.authStateSubject.pipe(
        map(state => state.user?.uid),
        distinctUntilChanged()
      );
    
    readonly isLoggedIn$ = this.authStateSubject.pipe(
      map(state => state.isLoggedIn),
      distinctUntilChanged()
    );
  
    readonly isLockedOut$ = this.authStateSubject.pipe(
      map(state => state.lockoutUntil && state.lockoutUntil > new Date()),
      distinctUntilChanged()
    );

    readonly token$ = this.authStateSubject.pipe(
        map(state => state.token),
        distinctUntilChanged()
      );

    readonly user$ = this.authStateSubject.pipe(
        map(state => state.user),
        distinctUntilChanged()
      );

    readonly viewPhone$ = this.userProfile$.pipe(
      map(user => user?.phone),
      distinctUntilChanged()
    );

    readonly username$ = this.userProfile$.pipe(
      map(user => user?.username),
      distinctUntilChanged()
    );

    readonly viewRole$ = this.userProfile$.pipe(
      map(user => user?.role),
      distinctUntilChanged()
    );

    readonly isAdmin$ = this.userProfile$.pipe(
      map(user => user?.role === UserRole.Administrator),
      distinctUntilChanged()
    );
      

    login(username: string, password: string): string{
      console.log('login auth-state.service.ts');
      let uid: string = '';
      from(signInWithEmailAndPassword(this.auth, username + '@midas-app.com', password)).subscribe({
        next: (userCredential) => {
          uid = userCredential.user.uid;
          this.authStateSubject.next({
            isLoggedIn: true,
            token: '',
            lastActivity: new Date(),
            failedAttempts: 0,
            user: userCredential.user
          });
          console.log('authState initialized successfully');
        },
        error: (error) => {
          return this.errorHandlingService.handleError(error, '');
        }
      })

      return uid;
      
      // .pipe(
      //   tap(userCredential => {
      //     this.authStateSubject.next({
      //       isLoggedIn: true,
      //       token: '',
      //       lastActivity: new Date(),
      //       failedAttempts: 0,
      //       user: userCredential.user
      //     });
      //     console.log('authState initialized successfully');
      //   }),
      //   map(userCredential => userCredential.user.uid),
      //   catchError(error => {
      //     return this.errorHandlingService.handleError(error, '');
      //   })
      // );
    }

      logout() {
        this.auth.signOut().then(() => {
            this.authStateSubject.next({
                isLoggedIn: false,
                token: null,
                lastActivity: null,
                failedAttempts: 0,
                user: null
            });
        });
      }
  }