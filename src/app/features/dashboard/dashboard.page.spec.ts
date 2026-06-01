import { TestBed } from '@angular/core/testing';

import { ActivityStore, type Activity } from '../../state/activity.store';
import { baseTestProviders } from '../../testing/test-helpers';
import { createActivityStoreStub } from '../../testing/store-stubs';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  beforeEach(async () => {
    const recent: Activity[] = [];
    const activityStore = createActivityStoreStub(recent);

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [...baseTestProviders(), { provide: ActivityStore, useValue: activityStore }],
    }).compileComponents();
  });

  it('should create and render heading', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Student Dashboard');
  });
});
