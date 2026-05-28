import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { ActivityStore } from '../../state/activity.store';
import { ProgressStore } from '../../state/progress.store';

@Component({
  selector: 'app-analytics-page',
  imports: [MatCardModule, RouterLink],
  templateUrl: './analytics.page.html',
})
export class AnalyticsPage {
  private readonly activityStore = inject(ActivityStore);
  private readonly progressStore = inject(ProgressStore);

  protected readonly recent = computed(() => this.activityStore.recent());

  protected readonly trackedLessons = computed(() => Object.keys(this.progressStore.progressByLessonId()).length);
  protected readonly completedLessons = computed(() => this.progressStore.totalCompletedLessons());
  protected readonly inProgressLessons = computed(() => {
    const values = Object.values(this.progressStore.progressByLessonId());
    return values.filter((p) => p > 0 && p < 100).length;
  });

  protected readonly quizAttempts = computed(() => this.recent().filter((a) => a.kind === 'quiz').length);
  protected readonly averageQuizPercent = computed(() => {
    const quizzes = this.recent().filter((a) => a.kind === 'quiz');
    if (quizzes.length === 0) return null;

    const total = quizzes.reduce((sum, q) => sum + q.total, 0);
    if (total <= 0) return null;
    const score = quizzes.reduce((sum, q) => sum + q.score, 0);
    return Math.round((score / total) * 100);
  });

  formatTime(at: number): string {
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(at);
    } catch {
      return new Date(at).toLocaleString();
    }
  }
}
