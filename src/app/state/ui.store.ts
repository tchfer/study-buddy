import { Injectable, effect, signal } from '@angular/core';

type UiState = {
  darkMode: boolean;
};

const STORAGE_KEY = 'studyBuddy.ui.v1';

function loadState(): UiState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { darkMode: false };

    const parsed = JSON.parse(raw) as Partial<UiState> | null;
    return {
      darkMode: Boolean(parsed?.darkMode),
    };
  } catch {
    return { darkMode: false };
  }
}

function saveState(state: UiState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors (private mode, quota, SSR)
  }
}

@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly darkMode = signal(loadState().darkMode);

  constructor() {
    effect(() => {
      saveState({ darkMode: this.darkMode() });
    });
  }

  setDarkMode(value: boolean): void {
    this.darkMode.set(value);
  }

  toggleDarkMode(): void {
    this.darkMode.update((v) => !v);
  }
}
