import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc, onSnapshot, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { Auth, User as FirebaseUser, user } from '@angular/fire/auth'
import { DocumentData, DocumentReference, QuerySnapshot, collection } from 'firebase/firestore';
import { BehaviorSubject, Observable, distinctUntilChanged, firstValueFrom, map, of, switchMap, takeUntil, tap, catchError } from 'rxjs';

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
  getUserObservable(uid: string): Observable<UserModel | null> {
    const isLoggedIn$ = this.auth.currentUser ? of(true) : of(false);
    return isLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return of(null); 
        }
        const userDocRef = doc(this.firestore, 'users', uid);
        return new Observable<UserModel | null>(observer => { 
          const unsubscribe = onSnapshot(userDocRef, 
            (docSnapshot: DocumentSnapshot<DocumentData>) => {
              if (docSnapshot.exists()) {
                observer.next(docSnapshot.data() as UserModel);
              } else {
                observer.next(null);
              }
            },
            (error) => observer.error(error)
          );
          // Return the unsubscribe function to be called when the Observable is unsubscribed
          return unsubscribe; 
        });
      })
    );
  }


  getAllUsers(): Observable<UserModel[]> {
    return this.userCollectionSnapshot$.pipe(
      map((snapshot: QuerySnapshot<DocumentData, DocumentData> | null) => {
        return snapshot ? snapshot.docs.map(doc => doc.data() as UserModel) : [];
      })
    );
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