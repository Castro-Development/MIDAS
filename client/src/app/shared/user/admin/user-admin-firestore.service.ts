import { Injectable } from "@angular/core";
import { UserApplication } from "../../dataModels/userModels/user.model";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { Observable, Subject, from, map, switchMap } from "rxjs";
import { SecurityStatus } from "../auth/user-security.facade";
import { DocumentSnapshot, collection, getDoc, onSnapshot } from "firebase/firestore";
import { ErrorHandlingService } from "../../errorHandling/error-handling.service";
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

    getUserSecurityStatus(username: string): Observable<SecurityStatus | null>  {
        const uid = this.getUid(username);
        console.log('getting user security status, uid: ', uid);
        return uid.pipe(
            switchMap((uid) => {
                const userSecurityDocRef = doc(this.firestore, 'userSecurity', uid);
                return getDoc(userSecurityDocRef)
                    .then((doc) => {
                        if(doc.exists()) {
                            return doc.data() as SecurityStatus;
                        }
                        return null;
                    })
            })
            
        )
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