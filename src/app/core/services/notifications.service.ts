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
        this.notifications = notific.notifications?.filter(notif => new Date(notif.schedule.at) >= new Date())|| [];
        this.changesSubject.next(true);
      }
    );
  }

  getScheduledNotificationsByNoteId(id) {
    return this.notifications?.filter(notif => notif.extra.id && notif.extra.id === id) || [];
  }

  deleteNotificationsFromNoteId(id: string | string[]) {
    const allIds = typeof id === 'string' ? [id] : id;
    const ids: {id: number}[] = allIds.reduce((result, currentId) =>
      result.concat(this.getScheduledNotificationsByNoteId(currentId).map(notif => ({id: notif.id}))), []);
      return LocalNotifications.cancel({notifications: ids}).then(() => this.loadPendingNotifications());
  }

  deleteNotification(id) {
    return LocalNotifications.cancel({notifications: [{id }]}).then(() => this.loadPendingNotifications());
  }

  schedule(data: {date: Date; noteId: string; title: string; body: string }): Promise<any> {
    const notification = {
      id: +StaticUtilsService.getRandomId(),
      title: data.title,
      smallIcon: 'res://icon.png',
      body: data.body,
      schedule: {at: new Date(data.date.getTime())},
      extra: {
        id: data.noteId
      },
      sound: null,
      vibrate: true,
      led: 'FF0000'
   };
    return LocalNotifications.schedule({notifications: [notification]}).then(() => {
      this.loadPendingNotifications();
      return true;
    });
  }
}
