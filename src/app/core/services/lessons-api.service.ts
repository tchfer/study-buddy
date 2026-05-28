import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Lesson } from '../models/lesson.model';
import { ApiCache } from './api-cache.service';

@Injectable({ providedIn: 'root' })
export class LessonsApi {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(ApiCache);

  getLessonsForCourse(courseId: string): Observable<Lesson[]> {
    const params = new HttpParams().set('courseId', courseId).set('_sort', 'order');
    return this.cache.get(`lessons:course:${courseId}`, () => this.http.get<Lesson[]>('/api/lessons', { params }));
  }

  getLessonById(lessonId: string): Observable<Lesson> {
    return this.cache.get(`lessons:id:${lessonId}`, () => this.http.get<Lesson>(`/api/lessons/${lessonId}`));
  }
}
