// messaging.model.ts

export enum MessageCategory {
    SYSTEM_ALERT = 'SYSTEM_ALERT',         // High priority system messages
    WORKFLOW = 'WORKFLOW',                 // Process-related notifications
    USER_MESSAGE = 'USER_MESSAGE',         // Direct user communications
    AUDIT = 'AUDIT',                       // System change notifications
    TASK = 'TASK'                         // Action items and reminders
  }
  
  export enum MessagePriority {
    URGENT = 'URGENT',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
  }
  
  export enum MessageStatus {
    UNREAD = 'UNREAD',
    READ = 'READ',
    ARCHIVED = 'ARCHIVED',
    DELETED = 'DELETED'
  }
  
  export enum ActionType {
    APPROVE_JOURNAL = 'APPROVE_JOURNAL',
    REJECT_JOURNAL = 'REJECT_JOURNAL',
    APPROVE_USER = 'APPROVE_USER',
    RESET_PASSWORD = 'RESET_PASSWORD',
    UPDATE_PASSWORD = 'UPDATE_PASSWORD',
    REVIEW_CHANGES = 'REVIEW_CHANGES'
  }
  
  export interface MessageAction {
    type: ActionType;
    entityId?: string;          // ID of related entity (journal entry, user, etc.)
    requiredBy?: Date;          // Deadline for action
    completedAt?: Date;         // When action was taken
    completedBy?: string;       // User ID who completed action
  }


export enum WorkflowType {
  JOURNAL_ENTRY = 'JOURNAL_ENTRY',
  PASSWORD_RESET = 'PASSWORD_RESET',
  USER_APPROVAL = 'USER_APPROVAL',
  USER_REJECTION = 'USER_REJECTION'
}
  
  export interface MessageMetadata {
    category: MessageCategory;
    sourceEntity?: {
      type: string;             // e.g., 'JOURNAL_ENTRY', 'USER_PROFILE'
      id: string;
    };
    expiresAt?: Date;          // When message should expire
    requiresEmail?: boolean;    // Should generate email
    emailSentAt?: Date;        // When email was sent
    action?: MessageAction;     // Required action details
  }
  
  export interface Message {
    id: string;
    category: MessageCategory;
    priority: MessagePriority;
    status: MessageStatus;
    sender: string;            // User ID or 'SYSTEM'
    recipients: string[];      // Array of user IDs
    subject: string;
    content: string;
    metadata: MessageMetadata;
    createdAt: Date;
    updatedAt: Date;
    readAt?: Date;
    readBy?: string[];        // Array of user IDs who've read
    actionRequired?: MessageAction;
    actionCompleted?: boolean;
  }
  
  // Pre-defined message templates for consistent messaging
  export const MessageTemplates = {
    PASSWORD_EXPIRY: {
      subject: 'Password Expiration Warning',
      content: (days: number) => 
        `Your password will expire in ${days} days. Please update it to maintain account access.`,
      category: MessageCategory.SYSTEM_ALERT,
      priority: MessagePriority.HIGH
    },
    JOURNAL_APPROVAL_REQUEST: {
      subject: 'Journal Entry Requires Approval',
      content: (entryId: string) => 
        `A new journal entry (${entryId}) has been submitted for your approval.`,
      category: MessageCategory.WORKFLOW,
      priority: MessagePriority.MEDIUM
    }
    // Add more templates as needed
  };

  export interface NotificationFilter {
    category: typeof MessageCategory | 'all';
    priority: typeof MessagePriority | 'all';
    type: typeof WorkflowType | 'all';
  }