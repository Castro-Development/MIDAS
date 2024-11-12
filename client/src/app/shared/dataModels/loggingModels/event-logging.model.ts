export enum EventType {
    SYSTEM_ERROR = 'SYSTEM_ERROR',
    ACCOUNT_CREATED = 'ACCOUNT_CREATED',
    ACCOUNT_UPDATED = 'ACCOUNT_UPDATED',
    ACCOUNT_DELETED = 'ACCOUNT_DELETED',
    JOURNAL_ENTRY_CREATED = 'JOURNAL_ENTRY_CREATED',
    JOURNAL_ENTRY_APPROVED = 'JOURNAL_ENTRY_APPROVED',
    USER_LOGGED_IN = 'USER_LOGGED_IN',
    USER_LOGGED_OUT = 'USER_LOGGED_OUT',
    ACCOUNT_BALANCE_UPDATED = "ACCOUNT_BALANCE_UPDATED",
    JOURNAL_ENTRY_SUBMITTED = "JOURNAL_ENTRY_SUBMITTED",
    JOURNAL_ENTRY_REJECTED = "JOURNAL_ENTRY_REJECTED",
    USER_APPLICATION_SUBMITTED = "USER_APPLICATION_SUBMITTED",
    ACCOUNT_MODIFICATION_REQUESTED = "ACCOUNT_MODIFICATION_REQUESTED",
    ACCOUNT_DEACTIVATED = "ACCOUNT_DEACTIVATED",
    ACCOUNT_ACCESS = "ACCOUNT_ACCESS"
}

export interface Event {
    type: EventType;
    payload: any;
    timestamp?: Date;
    source?: string;
}

export interface AccountEvent extends Event{
    accountId: string;

}

export interface AccountCreationEvent extends AccountEvent {
    userId: string;
    dateCreated: Date;
    postRef: string;
}

export interface AccountDeactivationEvent extends AccountEvent {
    adminId: string;
    dateDeactivated: Date;
    reason: string;
}

export interface AccountAccessEvent extends AccountEvent {
    userId: string;
    dateAccessed: Date;
    authorized: boolean;
}

export interface JournalEntryEvent extends Event {
    journalEntryId: string;
    accountId: string;
    userId: string;
    dateCreated: Date;
    postRef: string;
}

export interface UserEvent extends Event {
    userId: string;
}