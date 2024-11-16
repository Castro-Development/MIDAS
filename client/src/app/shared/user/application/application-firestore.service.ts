import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc, onSnapshot, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { User as FirebaseUser, user } from '@angular/fire/auth'
import { DocumentData, DocumentReference, QuerySnapshot, collection } from 'firebase/firestore';
import { BehaviorSubject, Observable, distinctUntilChanged, firstValueFrom, map, of, switchMap, takeUntil, tap, catchError } from 'rxjs';

import { UserApplication, UserApplicationWithMetaData, UserModel } from '../../dataModels/userModels/user.model';
import { AuthStateService } from '../auth/auth-state.service';
import { FilteringService } from '../../filter/filter.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationFirestoreService implements OnDestroy{
  
  private appCollectionSnapshotSubject = new BehaviorSubject<QuerySnapshot | null>(null);
  private appCollectionErrorSubject = new BehaviorSubject<any | null>(null);
  private appCollectionLoadingSubject = new BehaviorSubject<boolean>(false);

  appCollectionSnapshot$ = this.appCollectionSnapshotSubject.asObservable();

  private readonly destroySubject = new BehaviorSubject<void>(undefined);

  
  constructor(private firestore: Firestore, private authStateService: AuthStateService, private filterService: FilteringService) {
    this.initializeAppFirestoreService();
   }


   initializeAppFirestoreService(){
    console.log('ApplicationService initializing...');
    this.authStateService.isLoggedIn$.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(isLoggedIn => {
      if(!isLoggedIn){
        // Unsubscribe from previous snapshots when user logs in again
        this.destroySubject.next(); 

        onSnapshot(collection(this.firestore, 'applications'), 
          (snapshot) => this.appCollectionSnapshotSubject.next(snapshot), 
          (error) => this.appCollectionErrorSubject.next(error)
        );
      } 
    });
   }
  

  // Get user from uid
  getAppObservable(uid: string): Observable<UserApplicationWithMetaData | null> {
    return this.authStateService.isLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return of(null); 
        }
        const appDocRef = doc(this.firestore, 'applications', uid);
        return new Observable<UserApplicationWithMetaData | null>(observer => { 
          const unsubscribe = onSnapshot(appDocRef, 
            (docSnapshot: DocumentSnapshot<DocumentData>) => {
              if (docSnapshot.exists()) {
                observer.next(docSnapshot.data() as UserApplicationWithMetaData);
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


  


  

  ngOnDestroy(): void {
    this.appCollectionLoadingSubject.complete();
    this.appCollectionErrorSubject.complete();

    this.appCollectionSnapshotSubject.complete();
    this.destroySubject.next(); 
    this.destroySubject.complete();
  }
}