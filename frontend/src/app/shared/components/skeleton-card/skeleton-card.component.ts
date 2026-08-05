import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-card" [class.row]="variant === 'tool-pill' || variant === 'compact'">
      <ng-container [ngSwitch]="variant">
        <ng-container *ngSwitchCase="'tool'">
          <div class="sk-top"><div class="skeleton sk-icon"></div><div class="skeleton sk-tag"></div></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="sk-tags"><div class="skeleton sk-tag"></div><div class="skeleton sk-tag"></div></div>
        </ng-container>

        <ng-container *ngSwitchCase="'model'">
          <div class="sk-top"><div class="skeleton sk-icon"></div><div class="skeleton sk-tag"></div></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="sk-tags"><div class="skeleton sk-tag"></div><div class="skeleton sk-tag"></div><div class="skeleton sk-tag"></div></div>
        </ng-container>

        <ng-container *ngSwitchCase="'collection'">
          <div class="skeleton sk-icon"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </ng-container>

        <ng-container *ngSwitchCase="'workflow'">
          <div class="sk-top"><div class="skeleton sk-icon"></div><div class="skeleton sk-tag"></div></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="sk-tags"><div class="skeleton sk-tag"></div><div class="skeleton sk-tag"></div></div>
        </ng-container>

        <ng-container *ngSwitchCase="'workflow'">
          <div class="sk-top"><div class="skeleton sk-icon"></div><div class="skeleton sk-tag"></div></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div class="sk-tags"><div class="skeleton sk-tag"></div><div class="skeleton sk-tag"></div></div>
        </ng-container>

        <ng-container *ngSwitchCase="'tool-pill'">
          <div class="skeleton sk-icon"></div>
          <div class="pill-body">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        </ng-container>

        <ng-container *ngSwitchCase="'compact'">
          <div class="skeleton sk-icon"></div>
          <div class="pill-body">
            <div class="skeleton skeleton-title"></div>
          </div>
        </ng-container>

        <ng-container *ngSwitchDefault>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [`
    .skeleton-card { padding: 1.5rem; }
    .skeleton-card.row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.1rem 1.25rem;
      border-radius: var(--radius);
      background: var(--surface-1);
      border: 1px solid var(--border);
    }
    .sk-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.1rem; gap: 1rem; }
    .sk-icon { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
    .sk-tag { height: 22px; width: 70px; border-radius: 999px; }
    .sk-source { height: 12px; width: 90px; margin-bottom: 0.9rem; }
    .pill-body { flex: 1; min-width: 0; }
    .sk-tags { display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; }
    .skeleton-title { height: 13px; width: 55%; margin-bottom: 0.85rem; }
    .skeleton-text { height: 11px; width: 100%; margin-bottom: 0.55rem; }
    .skeleton-text.short { width: 65%; }
  `]
})
export class SkeletonCardComponent {
  @Input() variant: 'tool' | 'model' | 'collection' | 'workflow' | 'tool-pill' | 'compact' = 'tool';
}
