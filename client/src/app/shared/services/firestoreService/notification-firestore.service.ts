import { Injectable } from "@angular/core";
import { Firestore, onSnapshot, collection, QuerySnapshot } from "firebase/firestore";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { Notification } from "../../states/notification-state.service";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);

  constructor(firestore: Firestore) {
    onSnapshot(collection(firestore, 'notifications'), (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }) as Notification);
      this.notificationsSubject.next(notifications);
    });
  }

  readonly notifications$ = this.notificationsSubject.asObservable();
}