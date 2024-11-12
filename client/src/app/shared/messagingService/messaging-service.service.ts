import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Message, UserMessage } from '../dataModels/messageModel/message.model';
import { Firestore, addDoc, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private readonly firestore = inject(Firestore);


  constructor() {}


  sendMessage(message: Message) {
    //Get collection reference that corresponds to user's messages
    const messageCollection = collection(this.firestore, 'messages' + message.recipientUid);
    addDoc(messageCollection, message);
  }

  async getMessages(uid: string): Promise<Message[]> {
    //Get collection of messages that corresponds to user
    const querySnapshot = await getDocs(collection(this.firestore, 'messages' + uid));
    let messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data() as Message);
    });
    return messages;
  }
}
