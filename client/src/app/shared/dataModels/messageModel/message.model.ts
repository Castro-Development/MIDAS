export interface Message {
    message: string;
    timestamp: Date;
    read: boolean;
    recipientUid: string;
}

export interface UserMessage extends Message {
    senderUid:  string;
}
