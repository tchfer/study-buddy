import { Injectable, effect, signal } from '@angular/core';

export type LessonActivity = {
  kind: 'lesson';
  lessonId: string;
  title: string;
  at: number;
};

export type QuizActivity = {
  kind: 'quiz';
  quizId: string;
  title: string;
  score: number;
  total: number;
  at: number;
};

export type Activity = LessonActivity | QuizActivity;

const STORAGE_KEY = 'studyBuddy.activity.v1';
const MAX_ITEMS = 20;

function loadActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((x): x is Activity => typeof x === 'object' && x !== null)
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function saveActivities(value: Activity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value.slice(0, MAX_ITEMS)));
  } catch {
    // ignore storage errors (private mode, quota, SSR)
  }
}

@Injectable({ providedIn: 'root' })
export class ActivityStore {
  private readonly activities = signal<Activity[]>(loadActivities());

  readonly recent = this.activities.asReadonly();

  constructor() {
    effect(() => {
      saveActivities(this.activities());
    });
  }

  recordLesson(lessonId: string, title: string): void {
    const at = Date.now();
    const entry: LessonActivity = { kind: 'lesson', lessonId, title, at };

    this.activities.update((current) => {
      const withoutSame = current.filter((a) => !(a.kind === 'lesson' && a.lessonId === lessonId));
      return [entry, ...withoutSame].slice(0, MAX_ITEMS);
    });
  }

  recordQuiz(quizId: string, title: string, score: number, total: number): void {
    const at = Date.now();
    const entry: QuizActivity = { kind: 'quiz', quizId, title, score, total, at };

    this.activities.update((current) => {
      return [entry, ...current].slice(0, MAX_ITEMS);
    });
  }

  clear(): void {
    this.activities.set([]);
  }
}
