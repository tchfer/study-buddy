import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { AppNotification } from '../../core/models/notification.model';
import { NotificationsStore } from '../../state/notifications.store';

@Component({
  selector: 'app-notifications-page',
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './notifications.page.html',
})
export class NotificationsPage {
  private readonly router = inject(Router);
  private readonly store = inject(NotificationsStore);

  protected readonly notifications = computed(() => this.store.notifications());
  protected readonly unreadCount = computed(() => this.store.unreadCount());

  iconFor(item: AppNotification): string {
    switch (item.kind) {
      case 'lesson':
        return 'play_circle';
      case 'quiz':
        return 'quiz';
      default:
        return 'notifications';
    }
  }

  formatTime(at: number): string {
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(at);
    } catch {
      return new Date(at).toLocaleString();
    }
  }

  open(item: AppNotification): void {
    this.store.markRead(item.id);
    if (item.route) {
      void this.router.navigateByUrl(item.route);
    }
  }

  markAllRead(): void {
    this.store.markAllRead();
  }

  clearAll(): void {
    this.store.clear();
  }

  remove(item: AppNotification): void {
    this.store.remove(item.id);
  }
}
