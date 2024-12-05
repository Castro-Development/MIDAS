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
import { UserRole } from "../../dataModels/userModels/userRole.model";
import { Message, WorkflowType } from "../../dataModels/messageModel/message.model";
import { Timestamp } from "@angular/fire/firestore";



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
  getApplicationDetails(applicationId: string): Observable<UserApplication | undefined> {
    return this.userAdminService.getApplication(applicationId).pipe(
      tap(application => {
        if(application) this.selectedApplicationSubject.next(application)
        else throw new Error('Application not found');
      }),
      catchError(error => this.errorHandling.handleError('getApplicationDetails', undefined))
    );
  }

  /**
   * Processes application approval
   */
  approveApplication(userApp: UserApplication, approvalDetails: ApprovalDetails): Promise<void> {

        console.log("Approving application", userApp);
        const updatedApplication: UserApplication = {
          ...userApp,
          status: ApplicationStatus.Approved,
          dateApproved: new Date(),
          lastPWUpdate: new Date(),
          reviewedBy: approvalDetails.reviewerId,
          notes: approvalDetails.notes,
        };

        // Generate username if not already set
        if (!updatedApplication.username) {
          console.log("Generating username");
          return this.generateUsername(
            userApp.firstname,
            userApp.lastname,
            new Date()
          ).then((username) => {
            console.log("Generated username", username);
            this.userProfileFacade.createProfile({
              ...updatedApplication,
              username: username
            }as UserApplication).then(() => {console.log("Created profile")});
          })
        }else{
          this.userProfileFacade.createProfile(updatedApplication).then(() => {console.log("Created profile")});
          return this.userAdminService.updateApplication(updatedApplication);
        }



  }

  /**
   * Processes application rejection
   */
  rejectApplication(applicationId: string, rejectionDetails: RejectionDetails): Observable<void> {
    return this.userAdminService.getApplication(applicationId).pipe(
      switchMap(application => {
        if(application === undefined) throw new Error('Application not found');
        const updatedApplication: UserApplication = {
          ...application,
          status: ApplicationStatus.Rejected,
          datesDenied: application.datesDenied ? [...application.datesDenied, new Date()] : [new Date()],
          reviewedBy: rejectionDetails.reviewerId,
          notes: rejectionDetails.notes,
          requestedRole: UserRole.Guest
        };

        return this.userAdminService.updateApplication(updatedApplication);
      }),
      tap(() => {
        // Send notification
        this.notification.sendWorkflowNotification(applicationId, {
          subject: 'Application Rejected',
          content: `Your application has been rejected. Please contact the administrator for more information`,
          recipients: [applicationId]
        } as Message, WorkflowType.USER_REJECTION);
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
        const updatedApplication = { ...application, notes } as UserApplication;
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
