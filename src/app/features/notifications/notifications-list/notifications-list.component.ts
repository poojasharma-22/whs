import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { Notification } from '../../../models';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.scss'
})
export class NotificationsListComponent {
  notifications: Notification[] = [];

  constructor(private api: ApiService) {
    this.api.getNotifications().subscribe(list => this.notifications = list);
  }

  markRead(n: Notification) {
    if (n.read) return;
    this.api.markNotificationRead(n.id).subscribe(() => {
      n.read = true;
    });
  }
}
