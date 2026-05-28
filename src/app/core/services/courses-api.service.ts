import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesApi {
  private readonly http = inject(HttpClient);

  searchCourses(query: string): Observable<Course[]> {
    let params = new HttpParams();

    const trimmed = query.trim();
    if (trimmed.length > 0) {
      // json-server supports full-text search via `q`.
      params = params.set('q', trimmed);
    }

    return this.http.get<Course[]>('/api/courses', { params });
  }
}
