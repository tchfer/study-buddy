import { Provider } from '@angular/core';
import { convertToParamMap, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

export function baseTestProviders(): Provider[] {
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
