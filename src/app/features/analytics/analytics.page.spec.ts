import { TestBed } from '@angular/core/testing';

import { ActivityStore, type Activity } from '../../state/activity.store';
import { ProgressStore } from '../../state/progress.store';
import { baseTestProviders } from '../../testing/test-helpers';
import { createActivityStoreStub, createProgressStoreStub } from '../../testing/store-stubs';
import { AnalyticsPage } from './analytics.page';

describe('AnalyticsPage', () => {
  beforeEach(async () => {
    const recent: Activity[] = [
      { kind: 'quiz', quizId: 'q1', title: 'Quiz 1', score: 3, total: 5, at: 1 },
      { kind: 'quiz', quizId: 'q2', title: 'Quiz 2', score: 2, total: 5, at: 2 },
      { kind: 'lesson', lessonId: 'l1', title: 'Lesson 1', at: 3 },
    ];

    const activityStore = createActivityStoreStub(recent);
    const progressStore = createProgressStoreStub({ l1: 100, l2: 50 });

    await TestBed.configureTestingModule({
      imports: [AnalyticsPage],
      providers: [
        ...baseTestProviders(),
        { provide: ActivityStore, useValue: activityStore },
        { provide: ProgressStore, useValue: progressStore },
      ],
    }).compileComponents();
  });

  it('should create and render summary values', () => {
    const fixture = TestBed.createComponent(AnalyticsPage);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(el.textContent).toContain('Analytics');
    expect(el.textContent).toContain('Tracked lessons:');
    expect(el.textContent).toContain('2');
    expect(el.textContent).toContain('Attempts:');
  });

  it('formatTime returns a string', () => {
    const fixture = TestBed.createComponent(AnalyticsPage);
    const page = fixture.componentInstance;

    const value = page.formatTime(Date.now());
    expect(typeof value).toBe('string');
    expect(value.length).toBeGreaterThan(0);
  });
});
