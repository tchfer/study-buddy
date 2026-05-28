import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';

import { Course } from '../core/models/course.model';
import { CoursesApi } from '../core/services/courses-api.service';

type CoursesVm =
  | { status: 'loading'; courses: Course[] }
  | { status: 'success'; courses: Course[] }
  | { status: 'error'; courses: Course[]; message: string };

@Injectable({ providedIn: 'root' })
export class CoursesStore {
  private readonly api = inject(CoursesApi);

  private readonly query = signal('');

  private readonly vm = toSignal(
    toObservable(this.query).pipe(
      debounceTime(250),
      map((query) => query.trim()),
      distinctUntilChanged(),
      switchMap((query) =>
        this.api.searchCourses(query).pipe(
          map((courses): CoursesVm => ({ status: 'success', courses })),
          startWith({ status: 'loading', courses: [] } satisfies CoursesVm),
          catchError(() =>
            of({ status: 'error', courses: [], message: 'Failed to load courses.' } satisfies CoursesVm),
          ),
        ),
      ),
    ),
    { initialValue: { status: 'loading', courses: [] } },
  );

  readonly courses = computed(() => this.vm().courses);
  readonly loading = computed(() => this.vm().status === 'loading');
  readonly error = computed(() => {
    const vm = this.vm();
    return vm.status === 'error' ? vm.message : null;
  });

  setQuery(query: string): void {
    this.query.set(query);
  }

  getQuery(): string {
    return this.query();
  }
}
