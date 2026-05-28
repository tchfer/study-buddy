import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { LibraryStore } from '../../state/library.store';

@Component({
  selector: 'app-profile-page',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './profile.page.html',
})
export class ProfilePage {
  private readonly library = inject(LibraryStore);

  protected readonly favorites = computed(() => this.library.favorites());
  protected readonly history = computed(() => this.library.history());

  clearHistory(): void {
    this.library.clearHistory();
  }
}
