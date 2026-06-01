import { EnvironmentProviders, Provider } from '@angular/core';
import { convertToParamMap, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

if (!('IntersectionObserver' in globalThis)) {
  class MockIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '0px';
    readonly thresholds: readonly number[] = [0];

    private readonly observed = new Set<Element>();

    constructor(private readonly callback: IntersectionObserverCallback, private readonly options?: IntersectionObserverInit) {
      void this.callback;
      void this.options;
    }

    observe(target: Element): void {
      this.observed.add(target);
    }

    unobserve(target: Element): void {
      this.observed.delete(target);
    }

    disconnect(): void {
      this.observed.clear();
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}

export function baseTestProviders(): (Provider | EnvironmentProviders)[] {
  return [provideRouter([]), provideNoopAnimations()];
}

export function provideActivatedRouteParams(params: Record<string, string>): Provider {
  return {
    provide: ActivatedRoute,
    useValue: {
      paramMap: of(convertToParamMap(params)),
    },
  };
}
