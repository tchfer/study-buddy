import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { CoursesApi } from '../../core/services/courses-api.service';
import { LessonsApi } from '../../core/services/lessons-api.service';

@Component({
  selector: 'app-course-detail-page',
  imports: [RouterLink, MatCardModule, MatListModule, MatDividerModule, MatButtonModule],
  templateUrl: './course-detail.page.html',
})
export class CourseDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly coursesApi = inject(CoursesApi);
  private readonly lessonsApi = inject(LessonsApi);

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
}
