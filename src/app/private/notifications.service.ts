import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public notification$ = new ReplaySubject<Notification>(null);

  constructor() { }

  notify(notification, routerState?) {
    if (arguments.length === 1) {
      this.notification$.next(notification);
    } else {
      this.notification$.next();
    }

  }
}
