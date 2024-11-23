export interface Message {
    message: string;
    timestamp: Date;
    read: boolean;
    recipientUid: string;
    id: string;
}

export interface UserMessage extends Message {
    senderUid:  string;
}

export interface Notification extends Message {
    title: string;
    type: string;
    recipientUid: string;
}

export interface UserNotification extends Notification {
    senderUid: string;
}