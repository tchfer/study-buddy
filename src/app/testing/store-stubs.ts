import { computed, signal } from '@angular/core';

import type { Activity } from '../state/activity.store';
import type { FavoriteCourse, CourseHistoryItem } from '../state/library.store';
import type { AppNotification } from '../core/models/notification.model';
import type { Course } from '../core/models/course.model';

export function createActivityStoreStub(initial: Activity[] = []) {
  const recent = signal<Activity[]>(initial);
  return {
    recent,
    recordLesson: () => undefined,
    recordQuiz: () => undefined,
    clear: () => recent.set([]),
  };
}

export function createProgressStoreStub(initial: Record<string, number> = {}) {
  const progressByLessonId = signal<Record<string, number>>({ ...initial });
  const totalCompletedLessons = computed(() => Object.values(progressByLessonId()).filter((p) => p >= 100).length);

  return {
    progressByLessonId,
    totalCompletedLessons,
    getLessonProgress: (lessonId: string) => progressByLessonId()[lessonId] ?? 0,
    setLessonProgress: (lessonId: string, progressPercent: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));
      progressByLessonId.update((current) => ({ ...current, [lessonId]: clamped }));
    },
  };
}

export function createLibraryStoreStub(opts?: { favorites?: FavoriteCourse[]; history?: CourseHistoryItem[] }) {
  const favorites = signal<FavoriteCourse[]>(opts?.favorites ?? []);
  const history = signal<CourseHistoryItem[]>(opts?.history ?? []);

  return {
    favorites,
    history,
    favoriteCount: computed(() => favorites().length),
    isFavorite: (courseId: string) => favorites().some((f) => f.courseId === courseId),
    toggleFavorite: () => undefined,
    recordCourseView: () => undefined,
    clearHistory: () => history.set([]),
  };
}

export function createUiStoreStub(opts?: { darkMode?: boolean }) {
  const darkMode = signal(Boolean(opts?.darkMode));
  return {
    darkMode,
    setDarkMode: (value: boolean) => darkMode.set(value),
    toggleDarkMode: () => darkMode.update((v) => !v),
  };
}

export function createNotificationsStoreStub(initial: AppNotification[] = []) {
  const notifications = signal<AppNotification[]>(initial);
  const unreadCount = computed(() => notifications().filter((n) => !n.readAt).length);

  return {
    notifications,
    unreadCount,
    add: () => undefined,
    markRead: () => undefined,
    markAllRead: () => undefined,
    remove: () => undefined,
    clear: () => notifications.set([]),
  };
}

export function createCoursesStoreStub(initial?: {
  courses?: Course[];
  loading?: boolean;
  error?: string | null;
  query?: string;
}) {
  const courses = signal<Course[]>(initial?.courses ?? []);
  const loading = signal(Boolean(initial?.loading));
  const error = signal<string | null>(initial?.error ?? null);
  const query = signal(initial?.query ?? '');

  return {
    courses,
    loading,
    error,
    setQuery: (q: string) => query.set(q),
    getQuery: () => query(),
  };
}
