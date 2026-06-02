import { TestBed } from '@angular/core/testing';

import { UiStore } from './ui.store';

describe('UiStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles dark mode', () => {
    TestBed.configureTestingModule({});

    const store =
      TestBed.inject(UiStore);

    expect(store.darkMode())
      .toBe(false);

    store.toggleDarkMode();

    expect(store.darkMode())
      .toBe(true);
  });

  it('starts loading', () => {
    TestBed.configureTestingModule({});

    const store =
      TestBed.inject(UiStore);

    store.startLoading();

    expect(store.loading())
      .toBe(true);
  });

  it('stops loading', () => {
    TestBed.configureTestingModule({});

    const store =
      TestBed.inject(UiStore);

    store.startLoading();
    store.stopLoading();

    expect(store.loading())
      .toBe(false);
  });
});
