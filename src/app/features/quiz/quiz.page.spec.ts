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

  it('starts a quiz', async () => {

  const fixture =
    TestBed.createComponent(QuizPage);

  fixture.detectChanges();

  const page = fixture.componentInstance;

  page.start();

  const access =
    page as unknown as {
      started(): boolean;
    };

  expect(
    access.started()
  ).toBe(true);

});

it('increments score when answer is correct', async () => {

  const questions: Question[] = [
    {
      id: 'q1',
      quizId: 'quiz-alg-1',
      prompt: '2 + 2 = ?',
      options: ['3', '4'],
      correctIndex: 1,
    },
  ];

  await TestBed.configureTestingModule({
    imports: [QuizPage],
    providers: [
      ...baseTestProviders(),
      {
        provide: QuizzesApi,
        useValue: {
          getQuizzes: () => of([]),
          getQuestionsForQuiz: () => of(questions),
        },
      },
      { provide: ActivityStore, useValue: createActivityStoreStub() },
      { provide: NotificationsStore, useValue: createNotificationsStoreStub() },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(QuizPage);
  fixture.detectChanges();
  await fixture.whenStable();

  const page = fixture.componentInstance;

  const access = page as unknown as {
    selectedIndex: { set(value: number): void };
    score(): number;
  };

  page.start();

  access.selectedIndex.set(1);

  page.submitAndNext();

  expect(access.score()).toBe(1);
});

});
