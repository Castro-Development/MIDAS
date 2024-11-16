import { Injectable } from "@angular/core";
import { UserFirestoreService } from "../user-firestore.service";
import { ErrorHandlingService } from "../../errorHandling/error-handling.service";
import { UserApplication, UserModel } from "../../dataModels/userModels/user.model";
import { UserProfileStateService } from "../profile/user-profile-state.service";
import { AuthStateService } from "../auth/auth-state.service";
import { UserAdminFirestoreService } from "./user-admin-firestore.service";
import { SecurityStatus } from "../auth/user-security.facade";
import { Observable, Subject, map, switchMap } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class UserAdminFacade {
    

// **Business Purpose**: Orchestrates new user registration and approval process.

    constructor(
        private userProfileState: UserProfileStateService,
        private authStateService: AuthStateService,
        private errorHandling: ErrorHandlingService,
        private userAdminService: UserAdminFirestoreService
    ) {}
                                                        //------------------------------------------//
                                                        /* * * * * User Application Methods * * * * */
                                                        //------------------------------------------//
        /*
        *   Applies admin review decision to a user application
        *   @param applicationDecision: ApplicationDecision
        *   The decision to apply to the application
        */
    reviewUserApplication(applicationDecision: ApplicationDecision): Observable<void> {
        // get the uid out of the application decision,
        const applicationId = applicationDecision.applicationId;
        // user-admin-firestore.getApplication(uid)
        return this.userAdminService.getApplication(applicationId).pipe(
            switchMap((application: UserApplication) => {
                // find the one that corresponds to the given user id
                // updatedApplication = application with the status updated
                application.status = applicationDecision.decision;
                if(applicationDecision.notes) {
                    application.notes = applicationDecision.notes;
                }
                // user-admin-firestore.updateApplication(uid, updatedApplication)
                // update the status of the application to the given decision
                return this.userAdminService.updateApplication(application);
            })
        )
    }
        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
    getApplicationStatus(applicationId: string): Observable<string> {
        // user-admin-firestore.getApplication(uid)
        return this.userAdminService.getApplication(applicationId).pipe(
            switchMap((application: UserApplication) => {
                // return the status of the application
                return application.status;
            })
        )
        // return the status of the application
    }
        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
//   bulkReviewApplications(decisions: ApplicationDecision[]): Observable<void>;
        // get the uid out of the application decisions, then
        // user-admin-firestore.getAllApplications(uids[])
        // for each application,
        // find the one that corresponds to the given user id
        // updatedApplication = application with the status updated
        // user-admin-firestore.updateApplication(uid, updatedApplication)

        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
//   updateApplicationNotes(applicationId: string, notes: string): Observable<void>;
        // user-admin-firestore.getApplication(applicationId)
        // updatedApplication = application with the notes added
        // user-admin-firestore.updateApplication(applicationId, updatedApplication)

        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
//   requestAdditionalInfo(applicationId: string, request: InfoRequest): Observable<void>;
        // user-admin-firestore.getAllApplications(uid?: string)
        // updatedApplication = application with the request added
        // user-admin-firestore.updateApplication(applicationId, updatedApplication)

        
        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
//   getPendingApplications(): Observable<UserApplication[]>;
        // call the getPendingApplicationsMethod from the user admin firestore service
        // return the observable

        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
//   getApplicationHistory(userId: string): Observable<ApplicationHistory>;
        // call the getApplicationHistory from the user admin firestore service
        // return the observable

        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
//   searchApplications(criteria: ApplicationSearchCriteria): Observable<UserApplication[]>;
        // get all applications
        // filter the applications based on the given criteria

        /*
        *   Gets the status of a user application
        *
        *   @param applicationId: string
        * 
        */
//   getApplicationStats(): Observable<ApplicationStatistics>;
        // get all applications
        // increment each statistic based on the status of the application

        /*
        *   Generates username based on the given parameters
        *   @param firstName: string, lastName: string, dateCreated: Date
        *   
        *   @returns string
        */
    generateUsername(firstName: string, lastName: string, dateCreated: Date): Observable<string> {
        const usernameSubject = new Subject<string>();
        // generate a username based on the given parameters
        const suffix = this.getSuffix(dateCreated);
        const username = `${firstName[0]}${lastName}${suffix}`;
        while(this.validateUniqueUsername(username)) {
            const newUsername = username + (Math.random() * 10).toString();
            if(!this.validateUniqueUsername(newUsername)) {
                usernameSubject.next(newUsername);
            }
        }
        usernameSubject.next(username);
        return usernameSubject.asObservable();
    }
        /*
        *   Validates that the username is unique
        *   @param username: string
        *   
        *   @returns observable<boolean>
        */

    getSuffix(date: Date): string {
        const YYYY = date.getFullYear();
        const YY = YYYY.toString().slice(2);
        const MM = date.getMonth();
        return `${YY}${MM}`;
    }
    private validateUniqueUsername(username: string): Observable<boolean>{
        return this.userAdminService.getUsernames().pipe(
            map((usernames: string[]) => {
                return usernames.includes(username);
            })
        )
        // check if the given username is unique
    }
    
    
    // --------------------------------------------------------------------------------------------------------------------------------------- //
                                                        //------------------------------------------//
                                                        /* * * * * Role Management Methods * * * * */
    //   // Role Assignment                             //------------------------------------------//
    //   assignUserRole(userId: string, role: UserRole): Observable<void>;
            // user-admin-firestore.assignUserRole(userId, role)
    //   bulkAssignRoles(assignments: RoleAssignment[] = { userId: string, role: UserRole }): Observable<void>;
            // for each role assignment,
            // user-admin-firestore.assignUserRole(userId, role)
    //   upgradeUserRole(userId: string, newRole: UserRole): Observable<void>;
            // user-admin-firestore.assignUserRole(userId, newRole)
    //   // Role Queries
    //   getUserRoles(userId: string): Observable<UserRole[]>;
            // user-admin-firestore.getUserRoles(userId)
    //   getUsersByRole(role: UserRole): Observable<UserProfile[]>;
            // user-admin-firestore.getUsersByRole(role)
    

    // --------------------------------------------------------------------------------------------------------------------------------------- //
                                                        //---------------------------------------------------//
                                                        /* * * * * Account Status Management Methods * * * * */
    //                                                  //---------------------------------------------------//
    // // Suspension Management (R#1.17)
    // suspendUser(userId: string, reason: SuspensionReason): Observable<void>;
            // user-admin-firestore.suspendUser(userId, reason)
    // scheduleSuspension(userId: string, schedule: SuspensionSchedule): Observable<void>;
            // user-admin-firestore.scheduleSuspension(userId, schedule)
    // revokeSuspension(userId: string): Observable<void>;  
            // user-admin-firestore.revokeSuspension(userId)
    // extendSuspension(userId: string, duration: Duration): Observable<void>;
            // user-admin-firestore.extendSuspension(userId, duration)

    // // Status Queries
    // getSuspendedUsers(): Observable<SuspendedUser[]>;
            // user-admin-firestore.getSuspendedUsers()
    // getUserSuspensionHistory(userId: string): Observable<SuspensionRecord[]>;
            // user-firestore.getUser(userId)
            // return the suspension history
    // getSuspensionStatus(userId: string): Observable<SuspensionStatus>;
            // user-firestore.getUser(userId)
            // return the suspension status

    // --------------------------------------------------------------------------------------------------------------------------------------- //
                                                        //--------------------------------------------------//
                                                        /* * * * * System Access Management Methods * * * * */
    //                                                  //--------------------------------------------------//
    // Access Assignment
    // assignGeneralLedger(userId: string, ledgerId: string): Observable<void>;
        // user-admin-firestore.getGeneralLedger()
        // add userID to allowed general ledger users
        // user-admin-firestore.updateGeneralLedger(ledgerId, updatedLedger)
    // assignAccountAccess(userId: string, accountIds: string[]): Observable<void>;
        // for each account id,
            // user-admin-firestore.getAccountAccess(accountIds)
            // add userID to allowed account users
            // user-admin-firestore.updateAccountAccess(accountId, updatedAccount)
        
    // revokeGeneralLedger(userId: string, ledgerId: string): Observable<void>;
        // user-admin-firestore.getGeneralLedger()
        // remove userID from allowed general ledger users
        // user-admin-firestore.updateGeneralLedger(ledgerId, updatedLedger)
    // revokeAccountAccess(userId: string, accountIds: string[]): Observable<void>;
        // for each account id,
            // user-admin-firestore.revokeAccountAccess(userId, accountIds)
            // remove userID from allowed account users
            // user-admin-firestore.updateAccountAccess(accountId, updatedAccount)

    // // Access Queries
    // getGeneralLedgerAccess(userId: string): Observable<string[]>;
        // user-admin-firestore.getGeneralLedgerAccessUsers(userId)
    // getAccountAccessUsers(accountId: string): Observable<UserAccess[]>;
        // user-admin-firestore.getAccountAccessUsers(accountId)
    // validateUserAccess(userId: string, resourceId: string): Observable<boolean>;
        // log the access attempt
        // user-admin-firestore.validateUserAccess(userId, resourceId)
    // getAccessHistory(userId: string): Observable<AccessHistory[]>;
        // eventLogging.getAccessHistory(userId)

// --------------------------------------------------------------------------------------------------------------------------------------- //
                                                        //-----------------------------------------------//
                                                        /* * * * * Administrative Report Methods * * * * */
    //                                                  //-----------------------------------------------//
    // // Security Reports
    // getExpiredPasswordReport(): Observable<ExpiredPasswordReport>; // R#1.18
        // user-admin-firestore.getExpiredPasswordReport()
    // getAccountLockoutReport(): Observable<LockoutReport>;
        // user-admin-firestore.getAccountLockoutReport()
    // getFailedLoginReport(): Observable<FailedLoginReport>;
        // user-admin-firestore.getFailedLoginReport()
    // getSuspensionReport(): Observable<SuspensionReport>;
        // user-admin-firestore.getSuspensionReport()
    
    // // Activity Reports
    // getUserActivityReport(criteria: ActivityCriteria): Observable<ActivityReport>;
        // eventLogging.getUserActivityReport(criteria)
    // getSystemUsageReport(dateRange: DateRange): Observable<UsageReport>;
        // eventLogging.getSystemUsageReport(dateRange)
    // getRoleDistributionReport(): Observable<RoleDistributionReport>;
        // user-admin-firestore.getRoleDistributionReport()
    // getAccessViolationReport(): Observable<ViolationReport>;
        // eventLogging.getAccessViolationReport()
    // 

    // --------------------------------------------------------------------------------------------------------------------------------------- //
                                                        //-------------------------------------------------//
                                                        /* * * * * Administrative Override Methods * * * * */
    //                                                  //-------------------------------------------------//
    // // Security Overrides
    // overrideAccountLockout(userId: string, adminId: string): Observable<void>;
        // this.validateOverrideAuthority(adminId, OverrideType.AccountLockout)
        // eventLogging.logOverride(userId, adminId, OverrideType.AccountLockout)
        // user-admin-firestore.overrideAccountLockout(userId)
    // overridePasswordExpiry(userId: string, adminId: string, extension: Duration): Observable<void>;
        // this.validateOverrideAuthority(adminId, OverrideType.PasswordExpiry)
        // eventLogging.logPasswordExpiryOverride(userId, adminId, OverrideType.PasswordExpiry, extension)
        // user-admin-firestore.overridePasswordExpiry(userId, extension)
    
    // // Override Tracking
    // getActiveOverrides(): Observable<Override[]>;
        // eventLogging.getActiveOverrides()
    // getOverrideHistory(userId: string): Observable<OverrideHistory[]>;
        // eventLogging.getOverrideHistory(userId)
    // validateOverrideAuthority(adminId: string, overrideType: OverrideType): Observable<boolean>;
        // user-admin-firestore.validateOverrideAuthority(adminId, overrideType)
}
 
    
export interface ApplicationDecision {
    applicationId: string;
    decision: 'pending' | 'approved' | 'denied';
    notes?: string;

}