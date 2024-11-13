import { Injectable } from "@angular/core";
import { UserApplication } from "../../../shared/dataModels/userModels/user.model";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { Observable, Subject, from, map, of, switchMap, tap } from "rxjs";
import { SecurityStatus } from "../../../shared/facades/userFacades/user-security.facade";
import { DocumentSnapshot, collection, getDoc, onSnapshot } from "firebase/firestore";
import { ErrorHandlingService } from "../../../shared/services/error-handling.service";
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
        const appDocRef = doc(this.firestore, 'applications', userApplication.id);
        this.mapUserToUid(userApplication.username, userApplication.id);
        return setDoc(appDocRef, userApplication);
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
        getDoc(userSecurityDocRef).then((doc) => {
            if(doc.exists()) {
                return doc.data() as SecurityStatus;
            } else {
                return of(null);
            }
        }).then((status) => {
            if(status === null) {
                return of(this.setSecurityStatus(uid,
                    {
                        isLocked: false,
                        suspension: null,
                        passwordStatus: 'valid',
                        failedAttempts: 0
                    } as SecurityStatus
                ));
            }
            return of(status);
        });
        throw new Error('User security document does not exist');
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

    getUsernames(): Observable<string[]> {
        const usernamesSubject = new Subject<string[]>();
        onSnapshot(collection(this.firestore, 'usernameMap'), (snapshot) => {
            usernamesSubject.next(snapshot.docs.map((doc) => doc.id));
        });
        return usernamesSubject.asObservable();
    }
    suspendAccount() {}
}