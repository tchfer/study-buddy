import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

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
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Study Buddy');

  protected readonly navItems = signal<NavItem[]>([
    { label: 'Dashboard', path: '/dashboard', icon: 'space_dashboard' },
    { label: 'Course Catalog', path: '/courses', icon: 'school' },
    { label: 'Quiz', path: '/quiz', icon: 'quiz' },
    { label: 'Analytics', path: '/analytics', icon: 'insights' },
    { label: 'Profile', path: '/profile', icon: 'person' },
  ]);
}
