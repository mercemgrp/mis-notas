import { Injectable } from '@angular/core';
import { ActionPerformed, LocalNotifications, PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { BehaviorSubject, Observable } from 'rxjs';
import { StaticUtilsService } from './static-utils.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  changes$: Observable<true>;
  private changesSubject = new BehaviorSubject<true>(true);
  private notifications: PendingLocalNotificationSchema[] = [];
  constructor() {
    this.changes$ = this.changesSubject.asObservable();
    this.loadPendingNotifications();
  }

  loadPendingNotifications() {
    LocalNotifications.getPending().then(
      notific => {
        this.notifications = notific.notifications || [];
        this.changesSubject.next(true);
      }
    );
  }

  getScheduledNotificationsByNoteId(id) {
    return this.notifications?.filter(notif => notif.extra.id === id) || [];
  }

  schedule(data: {date: Date; noteId: string; title: string; body: string }) {
    const notification = {
      id: +StaticUtilsService.getRandomId(),
      title: data.title,
      smallIcon: 'favicon.ico',
      body: data.body,
      schedule: {at: new Date(data.date.getTime())},
      extra: {
        id: data.noteId
      },
      sound: null
   };
    LocalNotifications.schedule({notifications: [notification]});
    this.loadPendingNotifications();
  }
}
