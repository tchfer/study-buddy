import { TestBed } from '@angular/core/testing';

import { ProgressStore } from './progress.store';

describe('ProgressStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    TestBed.configureTestingModule({});

    const store =
      TestBed.inject(ProgressStore);

    expect(
      store.totalCompletedLessons(),
    ).toBe(0);
  });

  it('stores lesson progress', () => {
    TestBed.configureTestingModule({});

    const store =
      TestBed.inject(ProgressStore);

    store.setLessonProgress(
      'lesson-1',
      75,
    );

    expect(
      store.getLessonProgress('lesson-1'),
    ).toBe(75);
  });

  it('counts completed lessons', () => {
    TestBed.configureTestingModule({});

    const store =
      TestBed.inject(ProgressStore);

    store.setLessonProgress('a', 100);
    store.setLessonProgress('b', 100);

    expect(
      store.totalCompletedLessons(),
    ).toBe(2);
  });

  it('clamps progress above 100', () => {
    TestBed.configureTestingModule({});

    const store =
      TestBed.inject(ProgressStore);

    store.setLessonProgress(
      'lesson-1',
      999,
    );

    expect(
      store.getLessonProgress('lesson-1'),
    ).toBe(100);
  });
});
