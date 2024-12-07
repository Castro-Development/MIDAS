import { Injectable } from "@angular/core";
import { BehaviorSubject, map, distinctUntilChanged, Subject, switchMap, of, filter, takeUntil, catchError, tap, empty, Observable, interval } from "rxjs";
import { UserApplication, UserApplicationWithMetaData, UserModel } from "../../dataModels/userModels/user.model";
import { AuthStateService } from "../auth/auth-state.service";
import { UserFirestoreService } from "../user-firestore.service";
import { FirebaseApp } from "@angular/fire/app";
import { serverTimestamp } from "firebase/firestore";
import { UserRole } from "../../dataModels/userModels/userRole.model";
import { ErrorHandlingService } from "../../error-handling/error-handling.service";
import { SecurityStatus } from "../auth/user-security.facade";
import { User as FirebaseUser } from "firebase/auth";
import { UserAdminFirestoreService } from "../admin/user-admin-firestore.service";

  @Injectable({ providedIn: 'root' })
  export class UserProfileStateService {


    private readonly userProfileSubject = new BehaviorSubject<UserModel>({} as UserModel);

    private readonly destroy$ = new Subject<void>();

    readonly userProfile$ = this.userProfileSubject.asObservable();
    tempUser!: UserModel;

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

    currentUser(): UserModel{
      this.activeProfile$.subscribe((user) => {
        this.tempUser = user;
      });
      return this.tempUser;
    }

    createProfile(user: UserModel): Promise<void> {
        return this.firestoreService.createProfile(user);
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
