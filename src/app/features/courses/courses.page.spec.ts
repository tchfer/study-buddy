import { TestBed } from '@angular/core/testing';

import type { Course } from '../../core/models/course.model';
import { CoursesStore } from '../../state/courses.store';
import { LibraryStore } from '../../state/library.store';
import { baseTestProviders } from '../../testing/test-helpers';
import { createCoursesStoreStub, createLibraryStoreStub } from '../../testing/store-stubs';
import { CoursesPage } from './courses.page';

describe('CoursesPage', () => {
  it('should create and render heading', async () => {
    const courses: Course[] = [
      {
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
      },
    ];

    const baseStore = createCoursesStoreStub({ courses, loading: false, error: null, query: '' });
    const setQuery = vi.fn((q: string) => baseStore.setQuery(q));
    const store = { ...baseStore, setQuery };

    const baseLibrary = createLibraryStoreStub();
    const toggleFavorite = vi.fn();
    const library = { ...baseLibrary, toggleFavorite };

    await TestBed.configureTestingModule({
      imports: [CoursesPage],
      providers: [
        ...baseTestProviders(),
        { provide: CoursesStore, useValue: store },
        { provide: LibraryStore, useValue: library },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CoursesPage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Course Catalog');
  });

  it('onQueryInput delegates to CoursesStore.setQuery', async () => {
    const baseStore = createCoursesStoreStub({ courses: [], loading: false, error: null, query: '' });
    const setQuery = vi.fn((q: string) => baseStore.setQuery(q));
    const store = { ...baseStore, setQuery };

    const library = createLibraryStoreStub();

    await TestBed.configureTestingModule({
      imports: [CoursesPage],
      providers: [
        ...baseTestProviders(),
        { provide: CoursesStore, useValue: store },
        { provide: LibraryStore, useValue: library },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CoursesPage);
    const page = fixture.componentInstance;

    const event = { target: { value: 'biology' } } as unknown as Event;
    page.onQueryInput(event);

    expect(setQuery).toHaveBeenCalledWith('biology');
  });

  it('toggleFavorite delegates to LibraryStore.toggleFavorite', async () => {
    const store = createCoursesStoreStub({ courses: [], loading: false, error: null, query: '' });

    const baseLibrary = createLibraryStoreStub();
    const toggleFavorite = vi.fn();
    const library = { ...baseLibrary, toggleFavorite };

    await TestBed.configureTestingModule({
      imports: [CoursesPage],
      providers: [
        ...baseTestProviders(),
        { provide: CoursesStore, useValue: store },
        { provide: LibraryStore, useValue: library },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CoursesPage);
    const page = fixture.componentInstance;

    page.toggleFavorite('course-1', 'Algebra I');

    expect(toggleFavorite).toHaveBeenCalledWith('course-1', 'Algebra I');
  });
});
