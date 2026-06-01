import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import type { Question } from '../../core/models/question.model';
import { QuizzesApi } from '../../core/services/quizzes-api.service';
import { ActivityStore } from '../../state/activity.store';
import { NotificationsStore } from '../../state/notifications.store';
import { baseTestProviders } from '../../testing/test-helpers';
import { createActivityStoreStub, createNotificationsStoreStub } from '../../testing/store-stubs';
import { QuizPage } from './quiz.page';

describe('QuizPage', () => {
  it('should create and render heading', async () => {
    await TestBed.configureTestingModule({
      imports: [QuizPage],
      providers: [
        ...baseTestProviders(),
        {
          provide: QuizzesApi,
          useValue: {
            getQuizzes: () => of([]),
            getQuestionsForQuiz: () => of([]),
          },
        },
        { provide: ActivityStore, useValue: createActivityStoreStub() },
        { provide: NotificationsStore, useValue: createNotificationsStoreStub() },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(QuizPage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Interactive Quiz');
  });

  it('records activity and enqueues a notification on completion', async () => {
    const questions: Question[] = [
      {
        id: 'q1',
        quizId: 'quiz-alg-1',
        prompt: '2 + 2 = ?',
        options: ['3', '4'],
        correctIndex: 1,
      },
    ];

    const recordQuiz = vi.fn();
    const add = vi.fn();

    await TestBed.configureTestingModule({
      imports: [QuizPage],
      providers: [
        ...baseTestProviders(),
        {
          provide: QuizzesApi,
          useValue: {
            getQuizzes: () =>
              of([
                {
                  id: 'quiz-alg-1',
                  title: 'Algebra Basics',
                  description: '',
                  questionIds: ['q1'],
                  updatedAt: '2026-01-01',
                },
              ]),
            getQuestionsForQuiz: () => of(questions),
          },
        },
        { provide: ActivityStore, useValue: { ...createActivityStoreStub(), recordQuiz } },
        { provide: NotificationsStore, useValue: { ...createNotificationsStoreStub(), add } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(QuizPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const page = fixture.componentInstance;

    const pageAccess = page as unknown as {
      selectedIndex: { set(value: number | null): void };
      completed: () => boolean;
    };

    page.start();
    pageAccess.selectedIndex.set(1);
    page.submitAndNext();

    expect(pageAccess.completed()).toBe(true);
    expect(recordQuiz).toHaveBeenCalledWith('quiz-alg-1', 'Algebra Basics', 1, 1);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'quiz',
        title: 'Quiz completed',
      }),
    );
  });
});
