import { Component, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  private readonly recentCourseTitles = signal<string[]>(['Algebra I', 'Biology Basics']);

  protected readonly hasRecent = computed(() => this.recentCourseTitles().length > 0);
  protected readonly recent = computed(() => this.recentCourseTitles());
}
