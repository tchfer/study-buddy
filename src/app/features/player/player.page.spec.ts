import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import type { Lesson } from '../../core/models/lesson.model';
import { LessonsApi } from '../../core/services/lessons-api.service';
import { ActivityStore } from '../../state/activity.store';
import { NotificationsStore } from '../../state/notifications.store';
import { ProgressStore } from '../../state/progress.store';
import { baseTestProviders, provideActivatedRouteParams } from '../../testing/test-helpers';
import { createActivityStoreStub, createNotificationsStoreStub, createProgressStoreStub } from '../../testing/store-stubs';
import { PlayerPage } from './player.page';

describe('PlayerPage', () => {
  it('should create and render lesson title', async () => {
    const lesson: Lesson = {
      id: 'lesson-1',
      courseId: 'course-1',
      title: 'Variables',
      durationSeconds: 120,
      videoUrl: '',
      transcript: '',
      order: 1,
    };

    const recordLesson = vi.fn();

    await TestBed.configureTestingModule({
      imports: [PlayerPage],
      providers: [
        ...baseTestProviders(),
        provideActivatedRouteParams({ lessonId: 'lesson-1' }),
        { provide: LessonsApi, useValue: { getLessonById: () => of(lesson) } },
        { provide: ProgressStore, useValue: createProgressStoreStub() },
        { provide: ActivityStore, useValue: { ...createActivityStoreStub(), recordLesson } },
        { provide: NotificationsStore, useValue: createNotificationsStoreStub() },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PlayerPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Variables');
    expect(recordLesson).toHaveBeenCalledWith('lesson-1', 'Variables');
  });

  it('ticks progress and enqueues a completion notification', async () => {
    vi.useFakeTimers();

    const lesson: Lesson = {
      id: 'lesson-1',
      courseId: 'course-1',
      title: 'Fast Lesson',
      durationSeconds: 1,
      videoUrl: '',
      transcript: '',
      order: 1,
    };

    const baseProgress = createProgressStoreStub({ 'lesson-1': 0 });
    const setLessonProgress = vi.fn((lessonId: string, value: number) => baseProgress.setLessonProgress(lessonId, value));
    const progressStore = { ...baseProgress, setLessonProgress };

    const add = vi.fn();
    const notifications = { ...createNotificationsStoreStub(), add };

    await TestBed.configureTestingModule({
      imports: [PlayerPage],
      providers: [
        ...baseTestProviders(),
        provideActivatedRouteParams({ lessonId: 'lesson-1' }),
        { provide: LessonsApi, useValue: { getLessonById: () => of(lesson) } },
        { provide: ProgressStore, useValue: progressStore },
        { provide: ActivityStore, useValue: createActivityStoreStub() },
        { provide: NotificationsStore, useValue: notifications },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PlayerPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const page = fixture.componentInstance;

    page.togglePlay();

    vi.advanceTimersByTime(1000);

    expect(setLessonProgress).toHaveBeenCalled();
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'lesson',
        title: 'Lesson completed',
        message: 'Fast Lesson',
      }),
    );

    vi.useRealTimers();
  });
});
