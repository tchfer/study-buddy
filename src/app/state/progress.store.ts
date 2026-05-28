import { Injectable, computed, effect, signal } from '@angular/core';

const STORAGE_KEY = 'studyBuddy.progress.v1';

function loadProgress(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, number>;
  } catch {
    return {};
  }
}

function saveProgress(value: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage errors (private mode, quota, SSR)
  }
}

@Injectable({ providedIn: 'root' })
export class ProgressStore {
  private readonly progressByLessonIdInternal = signal<Record<string, number>>(loadProgress());

  readonly progressByLessonId = this.progressByLessonIdInternal.asReadonly();

  readonly totalCompletedLessons = computed(() =>
    Object.values(this.progressByLessonIdInternal()).filter((p) => p >= 100).length,
  );

  constructor() {
    effect(() => {
      saveProgress(this.progressByLessonIdInternal());
    });
  }

  getLessonProgress(lessonId: string): number {
    return this.progressByLessonIdInternal()[lessonId] ?? 0;
  }

  setLessonProgress(lessonId: string, progressPercent: number): void {
    const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));
    this.progressByLessonIdInternal.update((current) => ({ ...current, [lessonId]: clamped }));
  }
}
