import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { loadingInterceptor } from './loading.interceptor';
import { UiStore } from '../../state/ui.store';

describe('loadingInterceptor', () => {
  it('starts and stops loading around requests', () => {
    TestBed.configureTestingModule({
      providers: [
        UiStore,
        provideHttpClient(
          withInterceptors([loadingInterceptor]),
        ),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);
    const uiStore = TestBed.inject(UiStore);

    expect(uiStore.loading()).toBe(false);

    http.get('/api/test').subscribe();

    expect(uiStore.loading()).toBe(true);

    httpMock.expectOne('/api/test').flush({});

    expect(uiStore.loading()).toBe(false);
  });
});
