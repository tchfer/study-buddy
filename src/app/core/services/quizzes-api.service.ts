import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Question } from '../models/question.model';
import { Quiz } from '../models/quiz.model';
import { ApiCache } from './api-cache.service';

@Injectable({ providedIn: 'root' })
export class QuizzesApi {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(ApiCache);

  getQuizzes(): Observable<Quiz[]> {
    return this.cache.get('quizzes:all', () => this.http.get<Quiz[]>('/api/quizzes'));
  }

  getQuestionsForQuiz(quizId: string): Observable<Question[]> {
    const params = new HttpParams().set('quizId', quizId);
    return this.cache.get(`questions:quiz:${quizId}`, () => this.http.get<Question[]>('/api/questions', { params }));
  }
}
