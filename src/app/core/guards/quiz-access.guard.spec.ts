import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { ProgressStore } from '../../state/progress.store';
import { quizAccessGuard } from './quiz-access.guard';

const route = {} as ActivatedRouteSnapshot;
const state = {} as RouterStateSnapshot;

describe('quizAccessGuard', () => {
  it('allows access when a lesson is completed', () => {
    TestBed.configureTestingModule({
      providers: [ProgressStore],
    });

    const progressStore = TestBed.inject(ProgressStore);

    progressStore.setLessonProgress('lesson-1', 100);

    const result = TestBed.runInInjectionContext(() => quizAccessGuard(route, state));

    expect(result).toBe(true);
  });

  it('redirects when no lesson is completed', () => {
    const createUrlTree = vi.fn().mockReturnValue('redirect');

    TestBed.configureTestingModule({
      providers: [
        ProgressStore,
        {
          provide: Router,
          useValue: {
            createUrlTree,
          },
        },
      ],
    });

    const result = TestBed.runInInjectionContext(() => quizAccessGuard(route, state));

    expect(createUrlTree).toHaveBeenCalledWith(['/courses']);

    expect(result).toBe('redirect');
  });
});
