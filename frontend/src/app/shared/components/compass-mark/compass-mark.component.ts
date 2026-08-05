import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compass-mark',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      class="compass-mark"
      [class.light]="light"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true">
      <circle class="ring" cx="50" cy="50" r="46" stroke-width="1.6"/>
      <circle class="ring ring-inner" cx="50" cy="50" r="38" stroke-width="1"/>
      <g class="tick" stroke-width="2.6" stroke-linecap="round">
        <path d="M50 4.5 L50 9.5"/>
        <path d="M90.5 50 L95.5 50"/>
        <path d="M50 90.5 L50 95.5"/>
        <path d="M4.5 50 L9.5 50"/>
      </g>
      <g class="tick tick-minor" transform="rotate(45 50 50)" stroke-width="2" stroke-linecap="round">
        <path d="M50 6 L50 10"/>
        <path d="M90 50 L94 50"/>
        <path d="M50 90 L50 94"/>
        <path d="M6 50 L10 50"/>
      </g>
      <g
        class="needle"
        [class.spin]="loading"
        [style.transform]="'rotate(' + angle + 'deg)'">
        <path class="north" d="M50 13 L55.5 45 L50 50 L44.5 45 Z" stroke-width="3.2" stroke-linejoin="round"/>
        <path class="north north-bar" d="M47.8 31.5 L52.2 31.5" stroke-width="3.2" stroke-linecap="round"/>
        <path class="south" d="M50 50 L55 55 L50 87 L45 55 Z" opacity="0.4"/>
      </g>
      <circle class="hub" cx="50" cy="50" r="4" stroke-width="2"/>
      <circle class="hub-core" cx="50" cy="50" r="1.5"/>
    </svg>
  `,
  styles: [`
    .compass-mark { display: block; pointer-events: none; }
    .ring { stroke: var(--border-strong); opacity: 0.55; }
    .ring-inner { stroke: var(--border); opacity: 0.4; }
    .tick { stroke: var(--border-strong); opacity: 0.5; }
    .tick-minor { opacity: 0.35; }
    .north { stroke: var(--primary); }
    .south { fill: var(--text-3); }
    .hub { fill: var(--surface-1); stroke: var(--primary); }
    .hub-core { fill: var(--primary); }
    .needle {
      transform-box: view-box;
      transform-origin: 50px 50px;
      transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .needle.spin { animation: compassSpin 0.9s linear infinite; }
    @keyframes compassSpin {
      to { transform: rotate(360deg); }
    }
    .light .ring { stroke: rgba(255, 255, 255, 0.7); }
    .light .ring-inner { stroke: rgba(255, 255, 255, 0.32); }
    .light .tick { stroke: rgba(255, 255, 255, 0.6); }
    .light .tick-minor { opacity: 0.4; }
    .light .north { stroke: #fff; }
    .light .south { fill: rgba(255, 255, 255, 0.5); }
    .light .hub { fill: none; stroke: #fff; }
    .light .hub-core { fill: #fff; }
  `]
})
export class CompassMarkComponent {
  @Input() size = 40;
  @Input() angle = 0;
  @Input() loading = false;
  @Input() light = false;
}
