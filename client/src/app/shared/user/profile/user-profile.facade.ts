import { Injectable, inject } from "@angular/core";
import { UserApplication, UserModel } from "../../dataModels/userModels/user.model";
import { UserProfileStateService } from "./user-profile-state.service";
import { SecurityStatus } from "../auth/user-security.facade";
import { User } from "firebase/auth";
import { Observable, catchError, filter, from, map, tap } from "rxjs";
import { ErrorHandlingService } from "../../errorHandling/error-handling.service";


@Injectable({
    providedIn: 'root'
})
export class UserProfileFacade{
    userProfileState = inject(UserProfileStateService);

                                //-------------------------------//
                                /* * * * * State Observables * * */
                                //-------------------------------//
    
    

    

    constructor(
        private errorHandling: ErrorHandlingService
    ){}
        // User Profile

                                //----------------------------------------//
                                /* * * * * Personal Info Methods * * * * */
                                //----------------------------------------//
    // // Basic Info
    createProfile(user: UserApplication, user$: Observable<User | null>) {
        return this.userProfileState.createProfile(user, user$);
    }
    // updatePersonalInfo(userId: string, info: PersonalInfoUpdate): Observable<void>;
    // getPersonalInfo(userId: string): Observable<PersonalInfo>;
    // validatePersonalInfo(info: PersonalInfo): Observable<ValidationResult>;

    // // Contact Information
    // updateContactInfo(userId: string, info: ContactInfoUpdate): Observable<void>;
    // verifyContactInfo(userId: string, verificationType: VerificationType): Observable<void>;
    // getContactInfo(userId: string): Observable<ContactInfo>;
    // setPrimaryContact(userId: string, contactType: ContactType): Observable<void>;

    // // Profile Image
    uploadProfileImage(image: File): Observable<void>{
        throw new Error('Method not implemented.');
    }
    // getProfileImage(userId: string): Observable<ProfileImage>;
    // removeProfileImage(userId: string): Observable<void>;
    // cropProfileImage(userId: string, cropSettings: CropSettings): Observable<void>;

                                //------------------------------------------//
                                /* * * * * Data Management Methods * * * * */
                                //-----------------------------------------//
    // // Profile Operations
    // createProfile(userId: string, initialData: ProfileData): Observable<void>;
    private getProfile(userId: string): Observable<UserModel> {
        return from(this.userProfileState.getProfileState(userId)).pipe(
            filter((profile): profile is UserModel => profile !== null),
            catchError(() => this.errorHandling.handleError('User not found', {} as UserModel))
        );
    }
    // archiveProfile(userId: string): Observable<void>;
    // restoreProfile(userId: string): Observable<void>;
    loginProfile(userId: string) {
        console.log('loginProfile');
        this.getProfile(userId);
        console.log('loginProfile end');
    }

    // // Profile Validation
    // validateProfileCompleteness(userId: string): Observable<CompletenessResult>;
    // getProfileValidationErrors(userId: string): Observable<ValidationError[]>;
    // markProfileVerified(userId: string): Observable<void>;

    // // Profile History
    // getProfileChangeHistory(userId: string): Observable<ProfileChange[]>;
    // revertProfileChange(userId: string, changeId: string): Observable<void>;
    // getProfileVersion(userId: string, versionId: string): Observable<ProfileVersion>;

                                //------------------------------------------------//
                                /* * * * * Profile Customization Methods * * * * */
                                //-----------------------------------------------//

    // // Custom Fields
    // addCustomField(userId: string, field: CustomField): Observable<void>;
    // updateCustomField(userId: string, fieldId: string, value: any): Observable<void>;
    // removeCustomField(userId: string, fieldId: string): Observable<void>;
    // getCustomFields(userId: string): Observable<CustomField[]>;

    // // Layout Customization
    // updateDashboardLayout(userId: string, layout: DashboardLayout): Observable<void>;
    // getDashboardLayout(userId: string): Observable<DashboardLayout>;
    // resetDashboardLayout(userId: string): Observable<void>;

    // // Widget Preferences
    // updateWidgetSettings(userId: string, widgetId: string, settings: WidgetSettings): Observable<void>;
    // getWidgetPreferences(userId: string): Observable<WidgetPreferences>;

                                //--------------------------------------------//
                                /* * * * * Profile Analytics Methods * * * * */
                                //-------------------------------------------//

    // // Usage Analytics
    // getProfileUsageMetrics(userId: string): Observable<UsageMetrics>;
    // getProfileCompleteness(userId: string): Observable<CompletenessScore>;
    // getProfileEngagement(userId: string): Observable<EngagementMetrics>;

    // // System Interaction
    // trackFeatureUsage(userId: string, feature: Feature): Observable<void>;
    // getFeatureUsageStats(userId: string): Observable<FeatureStats>;
    // getInteractionHistory(userId: string): Observable<InteractionHistory>;

}

