import { NotificationFilter } from "../../states/notification-state.service";
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
}

export interface UserApplication extends UserModel{
  requestedRole: UserRole;
  dateRequested: Date;
  status: 'pending' | 'approved' | 'denied';
  datesDenied?: Date[];
  reviewedBy?: string;
  notes?: string;
}

export interface UserApplicationWithMetaData extends UserApplication{
  submittedOn: Date;
  
}

