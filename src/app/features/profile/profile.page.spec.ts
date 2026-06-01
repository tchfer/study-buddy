import { TestBed } from '@angular/core/testing';

import { LibraryStore } from '../../state/library.store';
import { UiStore } from '../../state/ui.store';
import { baseTestProviders } from '../../testing/test-helpers';
import { createLibraryStoreStub, createUiStoreStub } from '../../testing/store-stubs';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  it('should create and render heading', async () => {
    const library = createLibraryStoreStub();
    const ui = createUiStoreStub({ darkMode: false });

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        ...baseTestProviders(),
        { provide: LibraryStore, useValue: library },
        { provide: UiStore, useValue: ui },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Profile');
  });

  it('clearHistory delegates to LibraryStore', async () => {
    const library = createLibraryStoreStub();
    const ui = createUiStoreStub({ darkMode: false });

    const clearHistory = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        ...baseTestProviders(),
        { provide: LibraryStore, useValue: { ...library, clearHistory } },
        { provide: UiStore, useValue: ui },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfilePage);
    const page = fixture.componentInstance;

    page.clearHistory();
    expect(clearHistory).toHaveBeenCalledTimes(1);
  });
});
