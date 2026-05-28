import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ActivityStore } from '../../state/activity.store';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  private readonly activityStore = inject(ActivityStore);

  protected readonly recent = computed(() => this.activityStore.recent());
  protected readonly hasRecent = computed(() => this.recent().length > 0);
}
