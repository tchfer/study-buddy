import { Injectable, computed, effect, signal } from '@angular/core';

import { AppNotification, NotificationKind } from '../core/models/notification.model';

const STORAGE_KEY = 'studyBuddy.notifications.v1';
const MAX_ITEMS = 50;

function safeRandomId(): string {
  const randomUuid = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  if (randomUuid) return randomUuid();

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((x): x is AppNotification => typeof x === 'object' && x !== null)
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function saveNotifications(value: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value.slice(0, MAX_ITEMS)));
  } catch {
    // ignore storage errors (private mode, quota, SSR)
  }
}

export type CreateNotification = {
  kind: NotificationKind;
  title: string;
  message: string;
  route?: string;
};

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private readonly notificationsInternal = signal<AppNotification[]>(loadNotifications());

  readonly notifications = this.notificationsInternal.asReadonly();

  readonly unreadCount = computed(() => this.notificationsInternal().filter((n) => !n.readAt).length);

  constructor() {
    effect(() => saveNotifications(this.notificationsInternal()));
  }

  add(input: CreateNotification): void {
    const at = Date.now();
    const id = safeRandomId();

    const entry: AppNotification = {
      id,
      kind: input.kind,
      title: input.title,
      message: input.message,
      route: input.route,
      at,
    };

    this.notificationsInternal.update((current) => [entry, ...current].slice(0, MAX_ITEMS));
  }

  markRead(id: string): void {
    const at = Date.now();
    this.notificationsInternal.update((current) =>
      current.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: at } : n)),
    );
  }

  markAllRead(): void {
    const at = Date.now();
    this.notificationsInternal.update((current) => current.map((n) => (n.readAt ? n : { ...n, readAt: at })));
  }

  remove(id: string): void {
    this.notificationsInternal.update((current) => current.filter((n) => n.id !== id));
  }

  clear(): void {
    this.notificationsInternal.set([]);
  }
}
