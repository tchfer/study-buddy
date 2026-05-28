import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProgressStore {
  private readonly progressByLessonId = signal<Record<string, number>>({});

  readonly totalCompletedLessons = computed(() =>
    Object.values(this.progressByLessonId()).filter((p) => p >= 100).length,
  );

  getLessonProgress(lessonId: string): number {
    return this.progressByLessonId()[lessonId] ?? 0;
  }

  setLessonProgress(lessonId: string, progressPercent: number): void {
    const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));
    this.progressByLessonId.update((current) => ({ ...current, [lessonId]: clamped }));
  }
}
