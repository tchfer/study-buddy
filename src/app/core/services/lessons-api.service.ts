import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Lesson } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonsApi {
  private readonly http = inject(HttpClient);

  getLessonsForCourse(courseId: string): Observable<Lesson[]> {
    const params = new HttpParams().set('courseId', courseId).set('_sort', 'order');
    return this.http.get<Lesson[]>('/api/lessons', { params });
  }

  getLessonById(lessonId: string): Observable<Lesson> {
    return this.http.get<Lesson>(`/api/lessons/${lessonId}`);
  }
}
