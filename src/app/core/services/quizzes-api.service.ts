import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Question } from '../models/question.model';
import { Quiz } from '../models/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizzesApi {
  private readonly http = inject(HttpClient);

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>('/api/quizzes');
  }

  getQuestionsForQuiz(quizId: string): Observable<Question[]> {
    const params = new HttpParams().set('quizId', quizId);
    return this.http.get<Question[]>('/api/questions', { params });
  }
}
