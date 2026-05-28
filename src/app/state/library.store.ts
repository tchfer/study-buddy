import { Injectable, computed, effect, signal } from '@angular/core';

export type FavoriteCourse = {
  courseId: string;
  title: string;
  at: number;
};

export type CourseHistoryItem = {
  courseId: string;
  title: string;
  at: number;
};

const FAVORITES_KEY = 'studyBuddy.favorites.v1';
const HISTORY_KEY = 'studyBuddy.courseHistory.v1';
const MAX_ITEMS = 20;

function loadJsonArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as T[];
  } catch {
    return [];
  }
}

function saveJsonArray<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value.slice(0, MAX_ITEMS)));
  } catch {
    // ignore storage errors (private mode, quota, SSR)
  }
}

@Injectable({ providedIn: 'root' })
export class LibraryStore {
  private readonly favoritesInternal = signal<FavoriteCourse[]>(loadJsonArray<FavoriteCourse>(FAVORITES_KEY));
  private readonly historyInternal = signal<CourseHistoryItem[]>(loadJsonArray<CourseHistoryItem>(HISTORY_KEY));

  readonly favorites = this.favoritesInternal.asReadonly();
  readonly history = this.historyInternal.asReadonly();

  readonly favoriteCount = computed(() => this.favoritesInternal().length);

  constructor() {
    effect(() => saveJsonArray(FAVORITES_KEY, this.favoritesInternal()));
    effect(() => saveJsonArray(HISTORY_KEY, this.historyInternal()));
  }

  isFavorite(courseId: string): boolean {
    return this.favoritesInternal().some((f) => f.courseId === courseId);
  }

  toggleFavorite(courseId: string, title: string): void {
    const at = Date.now();

    this.favoritesInternal.update((current) => {
      const exists = current.some((f) => f.courseId === courseId);
      if (exists) {
        return current.filter((f) => f.courseId !== courseId);
      }
      return [{ courseId, title, at }, ...current].slice(0, MAX_ITEMS);
    });
  }

  recordCourseView(courseId: string, title: string): void {
    const at = Date.now();
    const entry: CourseHistoryItem = { courseId, title, at };

    this.historyInternal.update((current) => {
      const withoutSame = current.filter((h) => h.courseId !== courseId);
      return [entry, ...withoutSame].slice(0, MAX_ITEMS);
    });
  }

  clearHistory(): void {
    this.historyInternal.set([]);
  }
}
