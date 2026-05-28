import { Injectable } from '@angular/core';
import { Observable, defer } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiCache {
  private readonly cache = new Map<string, Observable<unknown>>();

  get<T>(key: string, fetch: () => Observable<T>): Observable<T> {
    const existing = this.cache.get(key);
    if (existing) return existing as Observable<T>;

    const request$ = defer(fetch).pipe(
      shareReplay({ bufferSize: 1, refCount: false }),
      catchError((err) => {
        this.cache.delete(key);
        throw err;
      }),
    );

    this.cache.set(key, request$);
    return request$;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
