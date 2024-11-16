import { Injectable } from "@angular/core";
import { UserApplication, UserApplicationWithMetaData } from "../../dataModels/userModels/user.model";
import { Subject, catchError, interval, map, switchMap, tap } from "rxjs";
import { ApplicationFirestoreService } from "./application-firestore.service";
import { ErrorHandlingService } from "../../errorHandling/error-handling.service";
import { UserRole } from "../../dataModels/userModels/userRole.model";


@Injectable({
    providedIn: 'root'
})
export class ApplicationStateService{

    private applicantSubject = new Subject<UserApplicationWithMetaData | null>();
    private applicantUidSubject = new Subject<string>();

    applicant$ = this.applicantSubject.asObservable();
    applicantUid$ = this.applicantUidSubject.asObservable();

    constructor(
        private appFirestoreService: ApplicationFirestoreService,
        private errorHandling: ErrorHandlingService
    ) {
        this.initAppStateService();
    }

    initAppStateService(){
        this.applicantUid$.subscribe((uid: string) => {
            if(!uid) {interval(1000);} else{
                this.appFirestoreService.getAppObservable(uid).pipe(
                    tap((application: UserApplicationWithMetaData | null) => {this.applicantSubject.next(application)})
                )
            }
        })
    }

    setApplicantUid(uid: string){
        this.applicantUidSubject.next(uid);
    }

}