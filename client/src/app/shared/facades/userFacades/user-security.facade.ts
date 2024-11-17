import { Injectable } from "@angular/core";
import { UserRole } from "../../dataModels/userModels/userRole.model";
import { Observable, Subject, catchError, combineLatest, filter, firstValueFrom, from, map, of, switchMap, take, tap } from "rxjs";
import { AuthStateService } from "../../states/auth-state.service";
import { ErrorHandlingService } from "../../services/error-handling.service";
import { Auth, User as FirebaseUser } from "@angular/fire/auth";
import { doc } from "@angular/fire/firestore";
import { UserApplication, UserModel } from "../../dataModels/userModels/user.model";
import { AccountFirestoreService } from "../../../portalModule/chartOfAccount/back-end/firestore/account-firestore.service";
import { PermissionType } from "../../dataModels/userModels/permissions.model";
import { AccountAccessEvent, EventType } from "../../dataModels/loggingModels/event-logging.model";
import { EventLogService } from "../../services/event-log.service";
import { UserProfileFacade } from "./user-profile.facade";
import { UserAdminFirestoreService } from "../../../adminModule/back-end/firestore/user-admin-firestore.service";
import { AccountLedger } from "../../dataModels/financialModels/account-ledger.model";



export interface SuspensionInfo {
    userId: string;
    reason: string;
    startDate: Date;
    endDate?: Date;  // undefined/null if permanent suspension
    suspendedBy: string;  // UID of admin who initiated suspension
}
interface SecurityStatusRequest {
    userId: string;
    includeHistory?: boolean;  // Optional flag for including historical data
}

// Output DTOs
interface SecurityStatusResponse {
    isLocked: boolean;
    isSuspended: boolean;
    passwordStatus: 'valid' | 'expiring' | 'expired';
    failedAttempts: number;
    lastUpdated: Date;
}

export interface SecurityStatus {
    isLocked: boolean;
    suspension: SuspensionInfo | null;
    passwordStatus: 'valid' | 'expiring' | 'expired';
    failedAttempts: number;
      
}

export interface PermissionCheckResult {
    granted: boolean;
    reason?: string;  // Optional explanation if permission denied
    requiredRole?: UserRole;  // If denial is role-based
}

@Injectable({ providedIn: 'root' })
export class UserSecurityFacade {
  /* * * * * Access Management Methods * * * * */
  //-------------------------------------------//
  
  
  
    
    
  // Role-Based Authorization
//   readonly hasRole$(role: UserRole): Observable<PermissionCheckResult>

  // Permission/Access Control
//   readonly hasPermission$(permission: Permission): Observable<PermissionCheckResult>
//   readonly hasPermissions(permissions: Permission[]): Observable<PermissionCheckResult[]>
//   readonly canAccess(feature: FeatureFlag): Observable<boolean>
//   readonly getAccessibleFeatures(): Observable<FeatureFlag[]>

  // Account Status Observables
//   readonly isAccountLocked$: Observable<boolean>
//   readonly passwordExpiresIn$: Observable<number>
//   readonly requiresPasswordChange$: Observable<boolean>
  
  // Consolidated Security Status
  readonly securityStatus$ = new Subject<SecurityStatus>();

    constructor(    private userAdminFirestore: UserAdminFirestoreService,
                    private errorHandling: ErrorHandlingService,
                    private authState: AuthStateService,
                    private accountFirestore: AccountFirestoreService,
                    private eventLogging: EventLogService,
                    private userProfileFacade: UserProfileFacade) 
    {}


                                //-----------------------------------------//
                                /* * * * * Authentication Methods * * * * */
                                //-----------------------------------------//

    // login(username: string, password: string): Observable<boolean> {
    //     console.log("Logging in user");
    //     return this.getUserSecurityStatus(username).pipe(
    //         switchMap(status => {
    //             if (status && status.isLocked) {
    //                 console.log("User is locked");
    //                 return of(false);
    //             }
    //             if (status && status.suspension) {
    //                 console.log("User is suspended");
    //                 return of(false);
    //             }
    //             if (status && status.passwordStatus === 'expired') {
    //                 console.log("Password is expired");
    //                 return of(false);
    //             }
    //             // Check failed login attempts
    //             if (status && status.failedAttempts >= 3) {
    //                 console.log("User has exceeded login attempts");
    //                 return of(false);
    //             }
    //             // Authenticate user
    //                 console.log("User authenticated");
    //                 return of(true);
    //             }),
    //             catchError((error) => this.errorHandling.handleError(error, false)),
    //             tap((success) => { 
    //                 if(success) { 
    //                     this.authState.login(username, password) 
    //                 }
    //                 this.userProfileFacade.loginProfile(username, this.authState.user$);
    //             })
    //             );
    //         }
        
    // } Can't get this shit to work, so I'm commenting it out for now.
    

    login(username: string, password: string)  {

        this.userProfileFacade.loginProfile(this.authState.login(username, password))


    }

    
    

    requestSystemAccess(user: UserApplication): Promise<void> {
        this.userProfileFacade.createProfile(user, this.authState.user$);
        return this.userAdminFirestore.submitApplication(user, this.authState.user$);
    }


    // private getUserSecurityStatus(uid: string): Observable<SecurityStatus> {
    //     console.log("Getting user security status");
    //     return this.userAdminFirestore.getUserSecurityStatus(uid);
    // } Can't get this S***T to work, so I'm commenting it out for now...

    // Password Management Methods
    validatePassword(uid: string, password: string): Observable<boolean> {
        const passwordComplexity = this.validatePasswordComplexity(password);
        const passwordHistory = this.validatePasswordHistory(uid, password);
        return combineLatest([passwordComplexity, passwordHistory]).pipe(
            switchMap(([complexity, history]) => {
                if (!complexity) {
                    return of(false);
                }
                if (!history) {
                    return of(false);
                }
                return of(true);
            }),
            catchError((error) => this.errorHandling.handleError(error, false))
        );
        
    }
                                //--------------------------------------------//
                                /* * * * * Access Management Methods * * * * */
                                //-------------------------------------------//

    grantAccess(accountId: string, userId: string): Promise<void> {
        return firstValueFrom(this.accountFirestore.getAccount(accountId).pipe(
            tap(account => {
                if(account) {
                    if(account.authorizedUsers.includes(userId)) {
                        throw new Error("User already has access to account");
                    } else{
                        account.authorizedUsers = [...account.authorizedUsers, userId];
                    }
                }
            }),
            catchError(() => { return this.errorHandling.handleError("Error granting access", {} as AccountLedger)}),
            switchMap(account => account ? this.accountFirestore.updateAccount(accountId, account) : of(void 0))
        ))
    }

    revokeAccess(accountId: string, userId: string): Promise<void> {
        return firstValueFrom(this.accountFirestore.getAccount(accountId).pipe(
            tap(account => {
                if(account) {
                    if(!account.authorizedUsers.includes(userId)) {
                        throw new Error("User does not have access to account");
                    } else{
                        account.authorizedUsers = account.authorizedUsers.filter(id => id !== userId);
                    }
                }
            }),
            catchError(() => { return this.errorHandling.handleError("Error granting access", {} as AccountLedger)}),
            switchMap(account => account ? this.accountFirestore.updateAccount(accountId, account) : of(void 0))
        ))
    }

    getAccountAccessList(accountId: string): Promise<string[]> {
        return firstValueFrom(this.accountFirestore.getAccount(accountId).pipe(
            map(account => account ? account.authorizedUsers : [] as string[]),
            catchError(() => { return this.errorHandling.handleError("Error getting access list", [])}),
        ))
      }

                                //--------------------------------------------//
                                /* * * * * Access Validation Methods * * * * */
                                //-------------------------------------------//

    validateAccess(user: UserModel, accountId: string): Promise<boolean> {
        return this.getAccountAccessList(accountId).then(users => {
            if(users.includes(user.id)) {
                return true;
            }else if(user.role === UserRole.Administrator) {
                return true;
            }
            return false;
        })
    }
    

    validatePermissions(permissionType: PermissionType, accountId: string): boolean {
        // Check if user has permission required to perform action
        // log the validation event
        throw new Error("Method not implemented.");
    }
    

                                //----------------------------------------------//
                                /* * * * * Password Management Methods * * * * */
                                //---------------------------------------------//
    // // Password Validation & Change
    // validatePasswordComplexity(password: string): ValidationResult;
    validatePasswordComplexity(password: string): Observable<boolean> {
        
        return from(
            of(password.length >= 8
            && /[A-Z]/.test(password)
            && /[a-z]/.test(password)
            && /[0-9]/.test(password)
            && /[^A-Za-z0-9]/.test(password))
        );
    }
    
    // validatePasswordHistory(userId: string, newPassword: string): Observable<boolean>;
    validatePasswordHistory(uid: string, password: string): Observable<boolean> {
        return of(true);
        // const userDocRef = doc(this.firestore, 'users', uid);
    }
    // changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void>;
    // forcePasswordChange(userId: string): Observable<void>;

    // // Password Reset
    // initiatePasswordReset(userId: string): Observable<ResetToken>;
    // validateResetToken(token: string): Observable<boolean>;
    // completePasswordReset(token: string, newPassword: string): Observable<void>;
    // cancelPasswordReset(token: string): Observable<void>;

    // // Password Expiration
    // checkPasswordExpiration(userId: string): Observable<ExpirationStatus>;
    // getPasswordExpirationDate(userId: string): Observable<Date>;
    // extendPasswordExpiration(userId: string, duration: Duration): Observable<void>;

    // // Password History
    // getPasswordChangeHistory(userId: string): Observable<PasswordHistory[]>;
    // clearPasswordHistory(userId: string): Observable<void>;


                                //--------------------------------------------//
                                /* * * * * Security Question Methods * * * * */
                                //-------------------------------------------//

// Security Question Methods
// setSecurityQuestions
// updateSecurityAnswers
// validateSecurityAnswers
// getSecurityQuestions
// resetSecurityQuestions

                                //------------------------------------------//
                                /* * * * * Security Status Methods * * * * */
                                //-----------------------------------------//

// Security Status Methods
// getSecurityStatus
// getSecurityMetrics

                                //-----------------------------------------//
                                /* * * * * Security Alert Methods * * * * */
                                //----------------------------------------//
// Security Alert Methods
// createSecurityAlert
// getActiveSecurityAlerts
// dismissSecurityAlert
// subscribeToSecurityAlerts

                                //--------------------------------------------//
                                /* * * * * Security Recovery Methods * * * * */
                                //-------------------------------------------//
// initiateAccountRecovery
// validateRecoverySteps
// completeAccountRecovery
// cancelAccountRecovery

  
}









/*## User Management Facades

isUserAuthorized - if not, check if user has pending application. If it does, return 'pending' status. If not, return 'unauthorized' status.

### UserSecurityFacade
**Business Purpose**: Manages user security policies and enforcement.

**Key Responsibilities**:
- Password expiration policies
- Account lockout rules
- Suspension management
- Security alert coordination
- Access control policies

**Interacts With**:
- UserProfileManagementFacade
- NotificationWorkflowFacade
- SystemConfigurationFacade

### UserProfileManagementFacade
**Business Purpose**: Handles user profile operations and updates.

**Key Responsibilities**:
- Profile update workflows
- Role change management
- User status changes
- Profile validation rules
- Access level changes

**Interacts With**:
- NotificationWorkflowFacade
- SystemConfigurationFacade
*/