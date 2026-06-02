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

import { loggingInterceptor } from './logging.interceptor';

describe('loggingInterceptor', () => {
  it('logs request information', () => {
    const logSpy =
      vi.spyOn(console, 'log')
        .mockImplementation(() => {
          // Mock implementation
        });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([loggingInterceptor]),
        ),
        provideHttpClientTesting(),
      ],
    });

    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    http.get('/api/test').subscribe();

    httpMock.expectOne('/api/test').flush({});

    expect(logSpy).toHaveBeenCalledWith(
      '[HTTP] GET /api/test',
    );
  });
});
