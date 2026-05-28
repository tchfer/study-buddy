import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';

import { Question } from '../../core/models/question.model';
import { QuizzesApi } from '../../core/services/quizzes-api.service';
import { ActivityStore } from '../../state/activity.store';

@Component({
  selector: 'app-quiz-page',
  imports: [MatCardModule, MatButtonModule, MatDividerModule, MatRadioModule, MatProgressBarModule],
  templateUrl: './quiz.page.html',
})
export class QuizPage {
  private readonly api = inject(QuizzesApi);
  private readonly activityStore = inject(ActivityStore);

  protected readonly quizzes = toSignal(this.api.getQuizzes(), { initialValue: [] });

  protected readonly selectedQuizId = signal<string>('quiz-alg-1');
  protected readonly started = signal(false);
  protected readonly completed = signal(false);

  protected readonly questions = toSignal(
    toObservable(this.selectedQuizId).pipe(switchMap((id) => this.api.getQuestionsForQuiz(id))),
    { initialValue: [] },
  );

  protected readonly index = signal(0);
  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly score = signal(0);

  private readonly secondsPerQuestion = 15;
  protected readonly secondsLeft = signal(this.secondsPerQuestion);

  protected readonly current = computed<Question | null>(() => this.questions()[this.index()] ?? null);
  protected readonly total = computed(() => this.questions().length);
  protected readonly progressPercent = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    return Math.round((this.index() / total) * 100);
  });

  constructor() {
    // Reset the runner when the quiz changes.
    toObservable(this.selectedQuizId)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.started.set(false);
        this.completed.set(false);
        this.index.set(0);
        this.score.set(0);
        this.selectedIndex.set(null);
        this.secondsLeft.set(this.secondsPerQuestion);
      });

    // Restart countdown when the question changes (only while started).
    toObservable(this.started)
      .pipe(
        switchMap((isStarted) =>
          isStarted
            ? toObservable(this.index).pipe(
                switchMap(() => timer(0, 1000).pipe(map((t) => this.secondsPerQuestion - t))),
              )
            : EMPTY,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((seconds) => {
        this.secondsLeft.set(Math.max(0, seconds));
        if (seconds === 0) {
          this.submitAndNext();
        }
      });
  }

  start(): void {
    this.started.set(true);
    this.completed.set(false);
    this.index.set(0);
    this.score.set(0);
    this.selectedIndex.set(null);
    this.secondsLeft.set(this.secondsPerQuestion);
  }

  submitAndNext(): void {
    const question = this.current();
    if (!question) return;

    const answer = this.selectedIndex();
    if (answer === question.correctIndex) {
      this.score.update((s) => s + 1);
    }

    this.selectedIndex.set(null);

    const nextIndex = this.index() + 1;
    if (nextIndex >= this.total()) {
      this.started.set(false);
      this.completed.set(true);

      const quizId = this.selectedQuizId();
      const quizTitle = this.quizzes().find((q) => q.id === quizId)?.title ?? 'Quiz';
      this.activityStore.recordQuiz(quizId, quizTitle, this.score(), this.total());
      return;
    }

    this.index.set(nextIndex);
    this.secondsLeft.set(this.secondsPerQuestion);
  }
}
