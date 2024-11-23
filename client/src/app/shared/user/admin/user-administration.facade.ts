import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, map, switchMap, tap, catchError, firstValueFrom } from "rxjs";
import { UserAdminFirestoreService } from "./user-admin-firestore.service";
import { ErrorHandlingService } from "../../error-handling/error-handling.service";
import { AuthStateService } from "../auth/auth-state.service";
import { NotificationFirestoreService } from "../../notification/notification-firestore.service";
import { ApprovalDetails, RejectionDetails, UserApplication } from "../../dataModels/userModels/user.model";
import { ApplicationStatus } from "../../dataModels/userModels/user-filter.model";
import { NotificationFacade } from "../../notification/notification.facade";
import { UserProfileFacade } from "../profile/user-profile.facade";



@Injectable({
  providedIn: 'root'
})
export class UserAdminFacade {
  private selectedApplicationSubject = new BehaviorSubject<UserApplication | null>(null);
  readonly selectedApplication$ = this.selectedApplicationSubject.asObservable();

  constructor(
    private userAdminService: UserAdminFirestoreService,
    private errorHandling: ErrorHandlingService,
    private authState: AuthStateService,
    private notification: NotificationFacade,
    private userProfileFacade: UserProfileFacade
  ) {}

  /**
   * Gets all applications with optional status filter
   */
  getApplications(status?: ApplicationStatus): Observable<UserApplication[] | null> {
    return this.userAdminService.getAllApplications().pipe(
      map(applications => status 
        ? applications.filter(app => app.status === status)
        : applications
      ),
      catchError(error => this.errorHandling.handleError('getApplications', null))
    );
  }

  /**
   * Gets single application details
   */
  getApplicationDetails(applicationId: string): Observable<UserApplication | null> {
    return this.userAdminService.getApplication(applicationId).pipe(
      tap(application => this.selectedApplicationSubject.next(application)),
      catchError(error => this.errorHandling.handleError('getApplicationDetails', null))
    );
  }

  /**
   * Processes application approval
   */
  approveApplication(applicationId: string, approvalDetails: ApprovalDetails): Observable<void> {
    return this.userAdminService.getApplication(applicationId).pipe(
      switchMap(application => {
        const updatedApplication: UserApplication = {
          ...application,
          status: ApplicationStatus.Approved,
          dateApproved: new Date(),
          reviewedBy: approvalDetails.reviewerId,
          notes: approvalDetails.notes
        };

        // Generate username if not already set
        if (!updatedApplication.username) {
          return this.generateUsername(
            application.firstname, 
            application.lastname,
            new Date()
          ).then(() => {
            this.userProfileFacade.createProfile(updatedApplication, firstValueFrom(this.authState.user$));
          })
        }

        return this.userAdminService.updateApplication(updatedApplication);
      }),
      tap(() => {
        // Send notification
        this.notification.sendApprovalNotification(applicationId);
      }),
      catchError(error => this.errorHandling.handleError('approveApplication', void 0))
    );
  }

  /**
   * Processes application rejection
   */
  rejectApplication(applicationId: string, rejectionDetails: RejectionDetails): Observable<void> {
    return this.userAdminService.getApplication(applicationId).pipe(
      switchMap(application => {
        const updatedApplication: UserApplication = {
          ...application,
          status: ApplicationStatus.Rejected,
          datesDenied: application.datesDenied ? [...application.datesDenied, new Date()] : [new Date()],
          reviewedBy: rejectionDetails.reviewerId,
          notes: rejectionDetails.notes
        };

        return this.userAdminService.updateApplication(updatedApplication);
      }),
      tap(() => {
        // Send notification
        this.notification.sendApplicationRejectionNotification(applicationId, rejectionDetails.reason);
      }),
      catchError(error => this.errorHandling.handleError('rejectApplication', void 0))
    );
  }

  /**
   * Updates application notes
   */
  updateApplicationNotes(applicationId: string, notes: string): Observable<void> {
    return this.userAdminService.getApplication(applicationId).pipe(
      switchMap(application => {
        const updatedApplication = { ...application, notes };
        return this.userAdminService.updateApplication(updatedApplication);
      }),
      catchError(error => this.errorHandling.handleError('updateApplicationNotes', void 0))
    );
  }

  

  /**
   * Generates unique username based on first initial, last name, and date
   */
  async generateUsername(firstName: string, lastName: string, dateCreated: Date): Promise<string> {
    // generate a username based on the given parameters
    const suffix = this.getSuffix(dateCreated);
    const username = `${firstName[0]}${lastName}${suffix}`;
    if(await this.validateUniqueUsername(username)) {
        return username;
    } else {
        return `${username}${Math.floor(Math.random() * 100)}`;
    }
}

  /**
   * Helper method to generate date suffix for username
   */
  getSuffix(date: Date): string {
    const YYYY = date.getFullYear();
    const YY = YYYY.toString().slice(2);
    const MM = date.getMonth();
    return `${YY}${MM}`;
  }

  /**
   * Helper method to validate unique username
   */

  private validateUniqueUsername(username: string): Promise<boolean>{
    return firstValueFrom(this.userAdminService.getUsernames()).then(
        (usernameMap: Record<string,string>) => {
            return !usernameMap[username];
        }
    )
    // check if the given username is unique
  }

}