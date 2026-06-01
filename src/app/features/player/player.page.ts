import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, filter, interval, map, switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Lesson } from '../../core/models/lesson.model';
import { LessonsApi } from '../../core/services/lessons-api.service';
import { ActivityStore } from '../../state/activity.store';
import { NotificationsStore } from '../../state/notifications.store';
import { ProgressStore } from '../../state/progress.store';

@Component({
  selector: 'app-player-page',
  imports: [MatCardModule, MatButtonModule, MatProgressBarModule, RouterLink],
  templateUrl: './player.page.html',
})
export class PlayerPage {
  private readonly route = inject(ActivatedRoute);
  private readonly lessonsApi = inject(LessonsApi);
  private readonly progressStore = inject(ProgressStore);
  private readonly activityStore = inject(ActivityStore);
  private readonly notifications = inject(NotificationsStore);

  protected readonly playing = signal(false);

  private readonly lessonId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('lessonId') ?? '')),
    { initialValue: '' },
  );

  protected readonly lesson = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('lessonId') ?? ''),
      switchMap((lessonId) => this.lessonsApi.getLessonById(lessonId)),
    ),
    { initialValue: null },
  );

  protected readonly progress = computed(() => this.progressStore.getLessonProgress(this.lessonId()));

  constructor() {
    toObservable(this.lesson)
      .pipe(
        filter((lesson): lesson is Lesson => lesson !== null),
        takeUntilDestroyed(),
      )
      .subscribe((lesson) => {
        this.activityStore.recordLesson(lesson.id, lesson.title);
      });

    // “Real-time progress”: tick while playing, update the store.
    toObservable(this.playing)
      .pipe(switchMap((isPlaying) => (isPlaying ? interval(1000) : EMPTY)), takeUntilDestroyed())
      .subscribe(() => {
        const lesson = this.lesson();
        if (!lesson) return;

        const lessonId = this.lessonId();
        if (!lessonId) return;

        const previous = this.progressStore.getLessonProgress(lessonId);
        const seconds = lesson.durationSeconds || 1;
        const increment = 100 / Math.max(1, Math.ceil(seconds / 10));
        const next = Math.min(100, previous + increment);
        const nextRounded = Math.max(0, Math.min(100, Math.round(next)));
        this.progressStore.setLessonProgress(lessonId, nextRounded);

        if (previous < 100 && nextRounded >= 100) {
          this.notifications.add({
            kind: 'lesson',
            title: 'Lesson completed',
            message: lesson.title,
            route: `/player/${lesson.id}`,
          });
        }

        if (nextRounded >= 100) {
          this.playing.set(false);
        }
      });
  }

  togglePlay(): void {
    this.playing.update((p) => !p);
  }

  reset(): void {
    this.playing.set(false);
    this.progressStore.setLessonProgress(this.lessonId(), 0);
  }
}
