import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TOOL_LOGOS } from '../../../core/constants/tool-logos';

@Component({
  selector: 'app-tool-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="logoPath; else monogram"
      class="tool-logo logo-img"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.borderRadius.px]="radius"
      [attr.aria-hidden]="true">
      <img [src]="logoPath" [alt]="name" [style.width.px]="size * 0.66" [style.height.px]="size * 0.66" loading="lazy">
    </div>
    <ng-template #monogram>
      <div
        class="tool-logo"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.borderRadius.px]="radius"
        [style.background]="color"
        [style.fontSize.px]="size * 0.42"
        [attr.aria-hidden]="true">
        {{ initial }}
      </div>
    </ng-template>
  `,
  styles: [`
    .tool-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 600;
      letter-spacing: -0.02em;
      flex-shrink: 0;
      user-select: none;
      text-transform: uppercase;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.22);
    }
    .logo-img {
      background: #fff;
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.22), 0 6px 18px -8px rgba(2, 6, 23, 0.45);
    }
    .logo-img img {
      display: block;
      object-fit: contain;
    }
  `]
})
export class ToolLogoComponent {
  @Input() name = '';
  @Input() size = 44;

  private palettes = [
    ['#6366f1', '#8b5cf6'],
    ['#0ea5e9', '#6366f1'],
    ['#f59e0b', '#ef4444'],
    ['#10b981', '#0ea5e9'],
    ['#ec4899', '#f59e0b'],
    ['#8b5cf6', '#ec4899'],
    ['#14b8a6', '#22d3ee'],
    ['#a855f7', '#6366f1'],
    ['#f97316', '#ef4444'],
    ['#06b6d4', '#3b82f6']
  ];

  get logoPath(): string | null {
    return TOOL_LOGOS[this.name] || null;
  }

  get initial(): string {
    return (this.name || '?').trim().charAt(0).toUpperCase();
  }

  get color(): string {
    let h = 0;
    const n = this.name || '';
    for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
    const [a] = this.palettes[h % this.palettes.length];
    return a;
  }

  get radius(): number {
    return Math.max(8, Math.round(this.size / 3.2));
  }
}
