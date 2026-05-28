import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from '../models/course.model';
import { ApiCache } from './api-cache.service';

@Injectable({ providedIn: 'root' })
export class CoursesApi {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(ApiCache);

  getCourseById(courseId: string): Observable<Course> {
    return this.cache.get(`courses:id:${courseId}`, () => this.http.get<Course>(`/api/courses/${courseId}`));
  }

  searchCourses(query: string): Observable<Course[]> {
    let params = new HttpParams();

    const trimmed = query.trim();
    if (trimmed.length > 0) {
      // json-server supports full-text search via `q`.
      params = params.set('q', trimmed);
    }

    const key = trimmed.length > 0 ? `courses:search:q=${encodeURIComponent(trimmed)}` : 'courses:search:all';
    return this.cache.get(key, () => this.http.get<Course[]>('/api/courses', { params }));
  }
}
