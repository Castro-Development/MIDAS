import { NotificationFilter } from "../../notification/notification-state.service";
import { ApplicationStatus } from "./user-filter.model";
import { UserRole } from "./userRole.model";

export interface UserModel{
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  street: string;
  zip: string;
  state: string;
  password: string;
  numDenied?: number;
  dateApproved?: Date;
  assignedGL?: string;
  assignedAccounts?: string[];
  role: UserRole;
  notificationFilter: NotificationFilter;
  lastPWUpdate?: Date;
}

export interface UserApplication extends UserModel{
  requestedRole: UserRole;
  dateRequested: Date;
  status: ApplicationStatus;
  datesDenied?: Date[];
  reviewedBy?: string;
  notes?: string;
}

export interface UserApplicationWithMetaData extends UserApplication{
  submittedOn: Date;

}

export interface ApprovalDetails {
  reviewerId: string;
  notes?: string;
  assignedRole: UserRole;
}

export interface RejectionDetails {
  reviewerId: string;
  reason: string;
  notes?: string;
}

