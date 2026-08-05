import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'ai-compass-theme';
  private readonly META_COLORS: Record<Theme, string> = {
    dark: '#0f172a',
    light: '#f7f8fb'
  };

  private _theme: Theme = 'dark';

  constructor(@Inject(DOCUMENT) private document: Document) {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this._theme = stored === 'light' ? 'light' : 'dark';
  }

  get theme(): Theme {
    return this._theme;
  }

  get isDark(): boolean {
    return this._theme === 'dark';
  }

  toggle(): void {
    this.apply(this._theme === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.apply(theme);
  }

  private apply(theme: Theme): void {
    this._theme = theme;
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.document.documentElement.setAttribute('data-theme', theme);

    const meta = this.document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', this.META_COLORS[theme]);
    }
  }
}
