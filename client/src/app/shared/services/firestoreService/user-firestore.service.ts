import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc, onSnapshot, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { Auth, User as FirebaseUser, user } from '@angular/fire/auth'
import { DocumentData, DocumentReference, QuerySnapshot, collection } from 'firebase/firestore';
import { BehaviorSubject, Observable, distinctUntilChanged, firstValueFrom, map, of, switchMap, takeUntil, tap, catchError, throwError } from 'rxjs';

import { UserApplication, UserModel } from '../../dataModels/userModels/user.model';
import { AuthStateService } from '../../states/auth-state.service';
import { SecurityStatus } from '../../facades/userFacades/user-security.facade';

@Injectable({
  providedIn: 'root'
})
export class UserFirestoreService implements OnDestroy{


  private userCollectionLoadingSubject = new BehaviorSubject<boolean>(false);
  private userCollectionErrorSubject = new BehaviorSubject<any | null>(null);
  private userCollectionSnapshotSubject = new BehaviorSubject<QuerySnapshot | null>(null);

  userCollectionSnapshot$ = this.userCollectionSnapshotSubject.asObservable();

  private readonly destroySubject = new BehaviorSubject<void>(undefined);


  constructor(private firestore: Firestore, private auth: Auth) {
    this.initializeUserFirestoreService();
   }


   initializeUserFirestoreService(){
    console.log('UserFirestoreService initializing...');

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


  // getAllUsers(): Observable<UserModel[]> {
  //   return this.userCollectionSnapshot$.pipe(
  //     map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
  //       return snapshot ? snapshot.docs.map(doc => doc.data() as UserModel) : [];
  //     })
  //   );
  // }
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


  async getUser(uid: string): Promise<UserModel | null> {
    return firstValueFrom(this.getUserObservable(uid));
  }

  async getAllUsersOnce(): Promise<UserModel[]> {
    const usersRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as UserModel);
  }


  // get all users with optional filter (consider adding type safety here)
  getAllUsersWhere(
    property: keyof UserModel,
    operator: '==' | '<' | '<=' | '>' | '>=',
    value: any
  ): Observable<UserModel[]> {
    return this.userCollectionSnapshot$.pipe(
      map((snapshot) => {
        if (!snapshot) return [];
        return snapshot.docs
          .map(doc => doc.data() as UserModel)
          .filter(user => {
            // Add type checking and null/undefined checks for propertyValue
            // ...
          });
      })
    );
  }




  ngOnDestroy(): void {
    this.userCollectionLoadingSubject.complete();
    this.userCollectionErrorSubject.complete();

    this.userCollectionSnapshotSubject.complete();
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

  createProfile(user: UserApplication): any {
    const profileDocRef = doc(collection(this.firestore, 'users'), user.id);
    return setDoc(profileDocRef, user);
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
