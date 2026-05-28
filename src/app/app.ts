import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UiStore } from './state/ui.store';
import { NotificationsStore } from './state/notifications.store';

type NavItem = {
  label: string;
  path: string;
  icon: string;
};

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly doc = inject(DOCUMENT);
  protected readonly ui = inject(UiStore);
  private readonly notifications = inject(NotificationsStore);

  protected readonly unreadNotifications = computed(() => this.notifications.unreadCount());

  protected readonly title = signal('Study Buddy');

  protected readonly navItems = signal<NavItem[]>([
    { label: 'Dashboard', path: '/dashboard', icon: 'space_dashboard' },
    { label: 'Course Catalog', path: '/courses', icon: 'school' },
    { label: 'Quiz', path: '/quiz', icon: 'quiz' },
    { label: 'Analytics', path: '/analytics', icon: 'insights' },
    { label: 'Notifications', path: '/notifications', icon: 'notifications' },
    { label: 'Profile', path: '/profile', icon: 'person' },
  ]);

  constructor() {
    effect(() => {
      const isDark = this.ui.darkMode();
      this.doc.body.classList.toggle('theme-dark', isDark);
      this.doc.body.classList.toggle('theme-light', !isDark);
    });
  }
}
