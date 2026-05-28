import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { Course } from '../../core/models/course.model';
import { CoursesApi } from '../../core/services/courses-api.service';
import { LessonsApi } from '../../core/services/lessons-api.service';
import { LibraryStore } from '../../state/library.store';

@Component({
  selector: 'app-course-detail-page',
  imports: [RouterLink, MatCardModule, MatListModule, MatDividerModule, MatButtonModule, MatIconModule],
  templateUrl: './course-detail.page.html',
})
export class CourseDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly coursesApi = inject(CoursesApi);
  private readonly lessonsApi = inject(LessonsApi);
  protected readonly library = inject(LibraryStore);

  protected readonly course = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('courseId') ?? ''),
      switchMap((id) => this.coursesApi.getCourseById(id)),
    ),
    { initialValue: null },
  );

  protected readonly lessons = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('courseId') ?? ''),
      switchMap((id) => this.lessonsApi.getLessonsForCourse(id)),
    ),
    { initialValue: [] },
  );

  constructor() {
    toObservable(this.course)
      .pipe(
        filter((course): course is Course => course !== null),
        takeUntilDestroyed(),
      )
      .subscribe((course) => {
        this.library.recordCourseView(course.id, course.title);
      });
  }

  toggleFavorite(courseId: string, title: string): void {
    this.library.toggleFavorite(courseId, title);
  }
}
