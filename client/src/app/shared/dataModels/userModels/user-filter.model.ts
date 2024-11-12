import { UserRole } from "./userRole.model";

export enum ApplicationStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

export interface UserFilter{
    applicationStatus: ApplicationStatus;
    role?: UserRole;
}