import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CoursesStore } from '../../state/courses.store';

@Component({
  selector: 'app-courses-page',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './courses.page.html',
})
export class CoursesPage {
  protected readonly store = inject(CoursesStore);

  onQueryInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.store.setQuery(target?.value ?? '');
  }
}
