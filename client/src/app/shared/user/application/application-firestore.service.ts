import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, CollectionReference, where, doc, getDocs, query, setDoc, onSnapshot, getDoc, DocumentSnapshot, deleteDoc } from '@angular/fire/firestore';
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
    
   }



  createApplication(app: UserApplication): Promise<void>{
    return setDoc(doc(this.firestore, 'applications', app.id), app);
  }

  getApplication(uid: string): Promise<UserApplicationWithMetaData | null> {
    return firstValueFrom(this.getAppObservable(uid));
  }

  deleteApplication(uid: string): Promise<UserApplication | null> {
    const app = this.getApplication(uid);
    return deleteDoc(doc(this.firestore, 'applications', uid)).then(() => {
      return app;
    });
  }

  updateApplication(uid: string): Promise<void> {
    return this.getApplication(uid).then(app => {
      if (app) {
        return setDoc(doc(this.firestore, 'applications', uid), app);
      } else{
        throw new Error('Application not found');
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
