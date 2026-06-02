import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { ProgressStore }
  from '../../state/progress.store';

export const quizAccessGuard: CanActivateFn =
  () => {

    const progressStore =
      inject(ProgressStore);

    const router =
      inject(Router);

    const hasCompletedLesson =
      Object.values(
        progressStore.progressByLessonId()
      ).some(
        progress => progress >= 100
      );

    if (hasCompletedLesson) {
      return true;
    }

    return router.createUrlTree([
      '/courses'
    ]);
  };
