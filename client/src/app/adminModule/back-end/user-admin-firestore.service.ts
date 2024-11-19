import { Injectable } from "@angular/core";
import { UserApplication } from "../../shared/dataModels/userModels/user.model";
import { Firestore, doc, docData, setDoc } from "@angular/fire/firestore";
import { Observable, Subject, catchError, from, map, of, switchMap, tap } from "rxjs";
import { SecurityStatus } from "../../shared/facades/userFacades/user-security.facade";
import { DocumentData, DocumentReference, DocumentSnapshot, addDoc, collection, getDoc, onSnapshot } from "firebase/firestore";
import { ErrorHandlingService } from "../../shared/services/error-handling.service";
import { User as FirebaseUser } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class UserAdminFirestoreService {


  constructor(
      private firestore: Firestore,
      private errorHandling: ErrorHandlingService
  ) {}

  // Submit a new user application
  submitApplication(userApplication: UserApplication, userAuth: Observable<FirebaseUser | null> ): Promise<void> {
    const appCollectionRef = collection(this.firestore, 'applications');
    return addDoc(appCollectionRef, userApplication).then((docRef) => {
        this.mapUserToUid(userApplication.username, docRef.id);
        userApplication.id = docRef.id;
        this.updateApplication(userApplication);
        return void 0;
    });
}

  getApplication(uid: string): Observable<UserApplication> {
      const appDocRef = doc(this.firestore, 'applications', uid);
      return new Observable<UserApplication>(observer => {
          const unsubscribe = onSnapshot(appDocRef, (docSnapshot: DocumentSnapshot) => {
              if(docSnapshot.exists()) {
                  observer.next(docSnapshot.data() as UserApplication);
              } else {
                  throw new Error('Application does not exist');
              }
          });
          return unsubscribe;
      });
  }

  updateApplication(userApplication: UserApplication): Promise<void> {
      const appDocRef = doc(this.firestore, 'applications', userApplication.id);
      return setDoc(appDocRef, userApplication);
  }

  getUserSecurityStatus(uid: string): Observable<SecurityStatus>  {
      const userSecurityDocRef = doc(this.firestore, 'userSecurity', uid);
      console.log(userSecurityDocRef);
      return from(getDoc(userSecurityDocRef)).pipe(
          map(docSnapshot => {
              if (!docSnapshot.exists()) {
                  throw new Error('Security status does not exist');
              }
              return docSnapshot.data() as SecurityStatus;
          }),
          catchError(error => {
              console.error('Error getting security status:', error);
              throw error;
          })
      );
  }

  setSecurityStatus(username: string, blankStatus: SecurityStatus): SecurityStatus {
      const uid = this.getUid(username).pipe(
          tap((uid) => {
              const userSecurityDocRef = doc(this.firestore, 'userSecurity', uid);
              return setDoc(userSecurityDocRef, blankStatus);
          })
      )
      return blankStatus;

  }

  private getUid(username: string): Observable<string> {
      const uidSubject = new Subject<string>();
      onSnapshot(collection(this.firestore, 'usernameMap'), (snapshot) => {
          snapshot.docs.map((doc) => {
              if(doc.id === username) {
                  uidSubject.next(doc.data()['uid']);
              }
          })
      });
      return uidSubject.asObservable();
  }

  private mapUserToUid(username: string, uid: string): Promise<void> {
      const usernameMapDocRef = doc(this.firestore, 'usernameMap', username);
      return setDoc(usernameMapDocRef, {uid: uid});
  }

  getUsernames(): Observable<Record<string,string>> {
      return new Observable<Record<string,string>>(observer => {
          const unsubscribe = onSnapshot(collection(this.firestore, 'usernameMap'), (snapshot) => {
              const usernameMap: Record<string,string> = {};
              snapshot.docs.map((doc) => {
                  usernameMap[doc.id] = doc.data()['uid'];
              });
              observer.next(usernameMap);
          });
          return unsubscribe;
      });
  }
  suspendAccount() {}
}
