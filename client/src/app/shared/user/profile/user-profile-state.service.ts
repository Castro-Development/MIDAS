import { Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged, Subject, switchMap, of, filter, takeUntil, catchError, tap, empty, Observable, interval } from "rxjs";
import { UserApplication, UserApplicationWithMetaData, UserModel } from "../../dataModels/userModels/user.model";
import { AuthStateService } from "../auth/auth-state.service";
import { UserFirestoreService } from "../user-firestore.service";
import { FirebaseApp } from "@angular/fire/app";
import { serverTimestamp } from "firebase/firestore";
import { UserRole } from "../../dataModels/userModels/userRole.model";
import { ErrorHandlingService } from "../../errorHandling/error-handling.service";
import { UserAdminFirestoreService } from "../admin/user-admin-firestore.service";
import { SecurityStatus } from "../auth/user-security.facade";
import { User as FirebaseUser } from "firebase/auth";
  
  @Injectable({ providedIn: 'root' })
  export class UserProfileStateService {
    
    private readonly userProfileSubject = new Subject<UserModel>();

    private readonly destroy$ = new Subject<void>();

    constructor(
        private authStateService: AuthStateService,
        private firestoreService: UserFirestoreService,
        private errorHandling: ErrorHandlingService,
        private userAdminService: UserAdminFirestoreService
    ) {
        this.initProfileState();
    }
  
    initProfileState() {
        const emptyUser: UserModel = {
            id: '',
            username: '',
            firstname: '',
            lastname: '',
            phone: '',
            street: '',
            zip: '',
            state: '',
            password: '',
            role: UserRole.Guest,
            notificationFilter: {
                type: 'all',
                priority: 'all',
                category: 'all'
            }
        }
        
        this.destroy$.next();

        this.authStateService.user$.pipe(
            switchMap(user => {
                if (!user) {
                    return of(emptyUser);
                }
                return this.firestoreService.getUserObservable(user.uid).pipe(
                    switchMap(profile => profile ? of(profile) : of(emptyUser)), //catcherror wasn't working properly, might refactor
                    tap((profile: UserModel) => {profile ? this.userProfileSubject.next(profile) : this.userProfileSubject.next(emptyUser)}),
                    takeUntil(this.destroy$),
                )
            })
        )
    
        this.authStateService.isLoggedIn$.pipe(
            switchMap((isLoggedIn): Observable<UserModel> => {
                if (!isLoggedIn) {
                    return of({} as UserModel);
                }
                
                return this.authStateService.getUid$.pipe(
                    filter((uid): uid is string => uid !== null && uid !== undefined),
                    switchMap(uid => 
                        this.firestoreService.getUserObservable(uid).pipe(
                            filter((profile): profile is UserModel => profile !== null),
                            tap(profile => {
                                this.userProfileSubject.next(profile ?? emptyUser);
                            }),
                            takeUntil(this.destroy$)
                        )
                    )
                );
            })
        );
    }
    
    // Don't forget to add in your class:
    
    readonly activeRole$ = this.userProfileSubject.pipe(
      map(profile => profile.role),
      distinctUntilChanged()
    );
  
    readonly activeProfile$ = this.userProfileSubject.pipe(
      map(profile => profile as UserModel ),
      distinctUntilChanged()
    );

    createProfile(user: UserApplication, userAuth$: Observable<FirebaseUser | null>) {
        // associate UserApplication data with the UserAuth's uid
        return userAuth$.pipe(
            switchMap(userAuth => {
                user.id = userAuth?.uid || '';
                return this.firestoreService.createProfile(user);
            })
        );
    }
    
  }