import { Injectable } from "@angular/core";
import { Auth, authState, getAuth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { BehaviorSubject, map, distinctUntilChanged, catchError, Subject, Observable, of, from, switchMap, tap } from "rxjs";
import { UserModel } from "../../dataModels/userModels/user.model";
import { ErrorHandlingService } from "../../errorHandling/error-handling.service";
import { User as FirebaseUser } from 'firebase/auth';
import { SecurityStatus } from "./user-security.facade";

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
    private readonly userProfileSubject = new BehaviorSubject<UserModel | null>(null);
    private userSecurityStatusSubject = new BehaviorSubject<SecurityStatus | null>(null);

    readonly userProfile$ = this.userProfileSubject.asObservable();
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

      login(username: string, password: string): Observable<boolean> {
        return from(signInWithEmailAndPassword(this.auth, username, password)).pipe(
            switchMap(userCredential => {
                return from(userCredential.user.getIdToken()).pipe(
                    tap(token => {
                        this.authStateSubject.next({
                            isLoggedIn: true,
                            token: token,
                            lastActivity: new Date(),
                            failedAttempts: 0,
                            user: userCredential.user
                        });
                    }),
                    map(() => true)
                );
            })
        );
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