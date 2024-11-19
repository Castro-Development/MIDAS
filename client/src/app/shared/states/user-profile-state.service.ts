import { Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged, Subject, switchMap, of, filter, takeUntil, catchError, tap, empty, Observable, interval } from "rxjs";
import { UserApplication, UserApplicationWithMetaData, UserModel } from "../dataModels/userModels/user.model";
import { AuthStateService } from "./auth-state.service";
import { UserFirestoreService } from "../services/firestoreService/user-firestore.service";
import { FirebaseApp } from "@angular/fire/app";
import { serverTimestamp } from "firebase/firestore";
import { UserRole } from "../dataModels/userModels/userRole.model";
import { ErrorHandlingService } from "../services/error-handling.service";
import { SecurityStatus } from "../facades/userFacades/user-security.facade";
import { User as FirebaseUser } from "firebase/auth";
import { UserAdminFirestoreService } from "../../adminModule/back-end/user-admin-firestore.service";

  @Injectable({ providedIn: 'root' })
  export class UserProfileStateService {


    private readonly userProfileSubject = new BehaviorSubject<UserModel>({} as UserModel);

    private readonly destroy$ = new Subject<void>();

    readonly userProfile$ = this.userProfileSubject.asObservable();

    constructor(
        private firestoreService: UserFirestoreService,
        private errorHandling: ErrorHandlingService,
        private userAdminService: UserAdminFirestoreService
    ) { }



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

    saveProfileState(username: string, user$: Observable<FirebaseUser | null>) {
        user$.pipe(
            tap((user) => {
                if (user) {
                    this.firestoreService.getUserObservable(user.uid).pipe(
                        tap(profile => {
                            console.log(profile);
                            if(profile) {this.userProfileSubject.next(profile)}
                            else {this.errorHandling.handleError('User not found', null)}
                        })
                    )
                }
                console.log('user not found in saveProfileState');
            })
        )
    }

    getProfileState(userId: string): Promise<UserModel | null> {
        console.log('getProfileState called uid:' + userId);
        return this.firestoreService.getUser(userId).then(
            (profile) => {
                console.log('getProfileState profile:' + profile);
                if(profile) {
                    this.userProfileSubject.next(profile);
                }
                return profile;
            }
        )
    }

  }
