import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc, onSnapshot, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { Auth, User as FirebaseUser, User, user } from '@angular/fire/auth'
import { DocumentData, DocumentReference, QuerySnapshot, Timestamp, collection } from 'firebase/firestore';
import { BehaviorSubject, Observable, distinctUntilChanged, firstValueFrom, map, of, switchMap, takeUntil, tap, catchError, throwError } from 'rxjs';

import { UserApplication, UserApplicationWithMetaData, UserModel } from '../dataModels/userModels/user.model';
import { AuthStateService } from './auth/auth-state.service';
import { SecurityStatus } from './auth/user-security.facade';
import { FilteringService } from '../filter/filter.service';

@Injectable({
  providedIn: 'root'
})
export class UserFirestoreService implements OnDestroy{


  private userCollectionLoadingSubject = new BehaviorSubject<boolean>(false);
  private userCollectionErrorSubject = new BehaviorSubject<any | null>(null);


  private readonly destroySubject = new BehaviorSubject<void>(undefined);


  constructor(private firestore: Firestore, private auth: Auth) {
   }




  // Get user from uid
  getUserObservable(uid: string): Observable<UserModel> {
    console.log('Getting user from uid:', uid);

    // Check if uid is valid
    if (!uid) {
      console.error('No uid provided to getUserObservable');
      return throwError(() => new Error('No uid provided'));
    }

    const userDocRef = doc(this.firestore, 'users', uid);
    console.log('Document reference:', userDocRef.path);

    return new Observable<UserModel>(observer => {
      console.log('Setting up snapshot listener for:', uid);  // Debug

      const unsubscribe = onSnapshot(
        userDocRef,
        (doc) => {
          console.log('Snapshot received:', doc.exists()); // Debug
          if (doc.exists()) {
            const data = doc.data() as UserModel;
            console.log('Document data:', data);
            observer.next(data);
          } else {
            console.log(`No document found for uid: ${uid}`);
            observer.error(new Error(`User document does not exist for uid: ${uid}`));
          }
        },
        (error) => {
          console.error('Firestore error:', error);
          observer.error(error);
        }
      );

      // Debug cleanup
      return () => {
        console.log('Cleaning up snapshot listener for:', uid);
        unsubscribe();
      };
    });
}


  getAllUsers(): Observable<UserModel[]> {
    return new Observable<UserModel[]>((observer) => {
      const usersRef = collection(this.firestore, 'users');
      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data() as UserModel);
        observer.next(users);
      });
      return () => unsubscribe();
    });
  }

  getAllApplications(): Observable<UserApplicationWithMetaData[]> {
    return new Observable<UserApplicationWithMetaData[]>((observer) => {
      const appDocRef = collection(this.firestore,  'applications');
      const unsubscribe = onSnapshot(appDocRef, (snapshot) => {
        const users = snapshot.docs.map(doc => {
          let tmpUser = doc.data() as UserApplication;
          if(tmpUser.dateApproved) tmpUser.dateApproved = (tmpUser.dateApproved as unknown as Timestamp).toDate();
          if(tmpUser.dateRequested) tmpUser.dateRequested = (tmpUser.dateRequested as unknown as Timestamp).toDate();
          return tmpUser as UserApplicationWithMetaData});
        observer.next(users);
      });
      return () => unsubscribe();
    });
  }

  async getUser(uid: string): Promise<UserModel | null> {
    return firstValueFrom(this.getUserObservable(uid));
  }

  async getAllUsersOnce(): Promise<UserModel[]> {
    const usersRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as UserModel);
  }


  ngOnDestroy(): void {
    this.userCollectionLoadingSubject.complete();
    this.userCollectionErrorSubject.complete();

    this.destroySubject.next();
    this.destroySubject.complete();
  }

  getUserSecurityStatus(username: string): Observable<SecurityStatus> {
    const uid = this.getUid(username);
    return uid.pipe(
        switchMap((uid) => {
            return new Observable<SecurityStatus>((observer) => {
                onSnapshot(doc(this.firestore, 'userSecurityStatus', uid), (doc) => {
                    if(doc.exists()) {
                      observer.next(doc.data() as SecurityStatus);
                    }
                })
            })
        })
    )
  }

  createProfile(user: UserModel): any {
    const profileDocRef = doc(collection(this.firestore, 'users'), user.id);
    return setDoc(profileDocRef, user);
  }

  updateProfile(user: Partial<UserModel>): any {
    const profileDocRef = doc(collection(this.firestore, 'users'), user.id);
    return setDoc(profileDocRef, user, {merge: true});
  }

  private getUid(username: string): Observable<string> {
    const uidSubject = new BehaviorSubject<string>('');
    onSnapshot(collection(this.firestore, 'users'), (snapshot) => {
        snapshot.docs.map((doc) => {
            if (doc.data()[username] === username) {
                uidSubject.next(doc.id);
            }
        })
    });
    return uidSubject.asObservable();
  }


}
