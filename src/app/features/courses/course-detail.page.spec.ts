import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import type { Course } from '../../core/models/course.model';
import type { Lesson } from '../../core/models/lesson.model';
import { CoursesApi } from '../../core/services/courses-api.service';
import { LessonsApi } from '../../core/services/lessons-api.service';
import { LibraryStore } from '../../state/library.store';
import { baseTestProviders, provideActivatedRouteParams } from '../../testing/test-helpers';
import { createLibraryStoreStub } from '../../testing/store-stubs';
import { CourseDetailPage } from './course-detail.page';

describe('CourseDetailPage', () => {
  it('should create, render course, and record view', async () => {
    const course: Course = {
      id: 'course-1',
      title: 'Algebra I',
      subject: 'Math',
      level: 'High School',
      description: 'Intro algebra',
      tags: ['algebra'],
      coverImageUrl: '',
      lessonIds: ['lesson-1'],
      quizIds: [],
      updatedAt: '2026-01-01',
    };

    const lessons: Lesson[] = [
      {
        id: 'lesson-1',
        courseId: 'course-1',
        title: 'Variables',
        durationSeconds: 120,
        videoUrl: '',
        transcript: '',
        order: 1,
      },
    ];

    const recordCourseView = vi.fn();
    const toggleFavorite = vi.fn();

    const library = {
      ...createLibraryStoreStub(),
      recordCourseView,
      toggleFavorite,
    };

    await TestBed.configureTestingModule({
      imports: [CourseDetailPage],
      providers: [
        ...baseTestProviders(),
        provideActivatedRouteParams({ courseId: 'course-1' }),
        { provide: CoursesApi, useValue: { getCourseById: () => of(course) } },
        { provide: LessonsApi, useValue: { getLessonsForCourse: () => of(lessons) } },
        { provide: LibraryStore, useValue: library },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CourseDetailPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Algebra I');
    expect(recordCourseView).toHaveBeenCalledWith('course-1', 'Algebra I');
  });

  it('toggleFavorite delegates to LibraryStore.toggleFavorite', async () => {
    const course: Course = {
      id: 'course-1',
      title: 'Algebra I',
      subject: 'Math',
      level: 'High School',
      description: 'Intro algebra',
      tags: ['algebra'],
      coverImageUrl: '',
      lessonIds: [],
      quizIds: [],
      updatedAt: '2026-01-01',
    };

    const toggleFavorite = vi.fn();

    const library = {
      ...createLibraryStoreStub(),
      toggleFavorite,
    };

    await TestBed.configureTestingModule({
      imports: [CourseDetailPage],
      providers: [
        ...baseTestProviders(),
        provideActivatedRouteParams({ courseId: 'course-1' }),
        { provide: CoursesApi, useValue: { getCourseById: () => of(course) } },
        { provide: LessonsApi, useValue: { getLessonsForCourse: () => of([]) } },
        { provide: LibraryStore, useValue: library },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CourseDetailPage);
    const page = fixture.componentInstance;

    page.toggleFavorite('course-1', 'Algebra I');

    expect(toggleFavorite).toHaveBeenCalledWith('course-1', 'Algebra I');
  });
});
