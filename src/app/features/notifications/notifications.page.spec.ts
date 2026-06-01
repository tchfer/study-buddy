import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NotificationsStore } from '../../state/notifications.store';
import { baseTestProviders } from '../../testing/test-helpers';
import { createNotificationsStoreStub } from '../../testing/store-stubs';
import { NotificationsPage } from './notifications.page';

describe('NotificationsPage', () => {
  it('should create and render heading', async () => {
    const store = createNotificationsStoreStub([]);

    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
      providers: [
        ...baseTestProviders(),
        { provide: Router, useValue: { navigateByUrl: vi.fn() } },
        { provide: NotificationsStore, useValue: store },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotificationsPage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Notifications');
  });

  it('open() marks read and navigates when route exists', async () => {
    const markRead = vi.fn();
    const navigateByUrl = vi.fn();

    const store = createNotificationsStoreStub([]);

    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
      providers: [
        ...baseTestProviders(),
        { provide: Router, useValue: { navigateByUrl } },
        { provide: NotificationsStore, useValue: { ...store, markRead } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotificationsPage);
    const page = fixture.componentInstance;

    const item = {
      id: 'n1',
      kind: 'lesson' as const,
      title: 'Lesson completed',
      message: 'Lesson 1',
      route: '/player/l1',
      at: 1,
    };

    page.open(item);

    expect(markRead).toHaveBeenCalledWith('n1');
    expect(navigateByUrl).toHaveBeenCalledWith('/player/l1');
  });
});
