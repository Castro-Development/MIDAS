import { Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged, Subject, switchMap, of, filter, takeUntil, catchError, tap, empty } from "rxjs";
import { UserApplication, UserApplicationWithMetaData, UserModel } from "../dataModels/userModels/user.model";
import { AuthStateService } from "./auth-state.service";
import { UserFirestoreService } from "../services/firestoreService/user-firestore.service";
import { FirebaseApp } from "@angular/fire/app";
import { serverTimestamp } from "firebase/firestore";
import { UserRole } from "../dataModels/userModels/userRole.model";
import { ErrorHandlingService } from "../services/error-handling.service";
import { UserAdminFirestoreService } from "../services/firestoreService/user-admin-firestore.service";
import { SecurityStatus } from "../facades/userFacades/user-security.facade";

  
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
    
        // this.authStateService.isLoggedIn$.pipe(
        //     switchMap(isLoggedIn => {
        //         if (!isLoggedIn) {
        //             return of({ profile: null });
        //         }
        //         return this.authStateService.getUid$.pipe(
        //             // Explicitly handle undefined/null case
        //             filter((uid): uid is string => uid !== null && uid !== undefined),
        //             map(uid => 
        //                 this.firestoreService.getUserObservable(uid).pipe(
        //                     catchError(error => this.errorHandling.handleError(error, emptyUser)),
        //                     tap((profile: UserModel) => {profile ? this.userProfileSubject.next(profile) : this.userProfileSubject.next(emptyUser)}),
        //                     takeUntil(this.destroy$),
        //                 )
        //             )
        //         );
        //     })
        // ); 
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

    submitApplication(userApp: UserApplication): Promise<void> {
        return this.userAdminService.submitApplication(userApp);
    }

    
  }