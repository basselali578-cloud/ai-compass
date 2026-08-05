import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-art',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      class="collection-art"
      viewBox="0 0 160 60"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [ngSwitch]="slug"
      [style.color]="color"
      [attr.role]="'img'"
      [attr.aria-label]="artTitle">
      <g *ngSwitchCase="'agents'">
        <circle cx="76" cy="24" r="10"/>
        <path d="M60 52 Q60 42 76 42 Q92 42 92 52"/>
        <circle cx="98" cy="16" r="8" opacity="0.55"/>
        <circle cx="103.7" cy="10.3" r="1.6" fill="currentColor" stroke="none"/>
        <path d="M58 7 Q59.75 10.25 63 12 Q59.75 13.75 58 17 Q56.25 13.75 53 12 Q56.25 10.25 58 7 Z"/>
        <path d="M112 34.5 Q113.2 35.8 115.5 37 Q113.2 38.2 112 39.5 Q110.8 38.2 108.5 37 Q110.8 35.8 112 34.5 Z"/>
      </g>
      <g *ngSwitchCase="'students'">
        <path d="M58 44 V26 Q58 22 62 22 H74 Q78 22 78 26 V44"/>
        <path d="M78 44 V26 Q78 22 82 22 H94 Q98 22 98 26 V44"/>
        <path d="M78 26 V44"/>
        <path d="M28 52 L46 34 L54 42 L36 60 Z"/>
        <path d="M46 34 L52 28 L54 40 Z"/>
        <circle cx="52" cy="30" r="1.3" fill="currentColor" stroke="none"/>
        <circle cx="132" cy="18" r="9"/>
        <path d="M129 27 L135 27 L134 33 L130 33 Z"/>
        <path d="M129 16 Q132 22 135 16"/>
        <path d="M146 8.5 Q147.2 9.8 149.5 11 Q147.2 12.2 146 13.5 Q144.8 12.2 142.5 11 Q144.8 9.8 146 8.5 Z"/>
      </g>
      <g *ngSwitchCase="'developers'">
        <path d="M46 16 H86 Q90 16 90 20 V34 Q90 38 86 38 H46 Q42 38 42 34 V20 Q42 16 46 16 Z"/>
        <path d="M36 42 H96 L90 38 H42 Z"/>
        <path d="M53 24 L49 27 L53 30"/>
        <path d="M58 23 L56 31"/>
        <path d="M63 24 L67 27 L63 30"/>
        <circle cx="106" cy="20" r="4.5"/>
        <path d="M110.5 20 H120.5"/>
        <circle cx="126" cy="20" r="3"/>
        <path d="M126 23 V30 H138"/>
        <circle cx="144" cy="30" r="2.5"/>
        <path d="M129 20 H140.5"/>
        <circle cx="143" cy="17" r="2.5"/>
      </g>
      <g *ngSwitchCase="'free-ai'">
        <path d="M70 28 H114 V52 H70 Z"/>
        <path d="M66 22 H118 L114 28 H70 Z"/>
        <path d="M92 28 V52"/>
        <path d="M70 40 H114"/>
        <path d="M92 22 Q84 14 87 8 Q91 8 92 14"/>
        <path d="M92 22 Q100 14 97 8 Q93 8 92 14"/>
        <circle cx="92" cy="19" r="1.6" fill="currentColor" stroke="none"/>
        <path d="M58 15.5 Q59.6 16.9 62.5 18 Q59.6 19.1 58 20.5 Q56.4 19.1 53.5 18 Q56.4 16.9 58 15.5 Z"/>
        <path d="M124 10.5 Q125.2 11.8 127.5 13 Q125.2 14.2 124 15.5 Q122.8 14.2 120.5 13 Q122.8 11.8 124 10.5 Z"/>
        <path d="M126 35 Q127.05 36.05 129 37 Q127.05 37.95 126 39 Q124.95 37.95 123 37 Q124.95 36.05 126 35 Z"/>
      </g>
      <g *ngSwitchCase="'replace-photoshop'">
        <path d="M42 14 H86 V46 H42 Z"/>
        <path d="M64 26 H108 V58 H64 Z"/>
        <path d="M72 52 L84 40 L96 52"/>
        <circle cx="88" cy="42" r="2.5" fill="currentColor" stroke="none"/>
        <path d="M112 12.5 Q113.2 13.8 115.5 15 Q113.2 16.2 112 17.5 Q110.8 16.2 108.5 15 Q110.8 13.8 112 12.5 Z"/>
      </g>
      <g *ngSwitchCase="'replace-canva'">
        <path d="M50 18 H98 Q102 18 102 22 V46 Q102 50 98 50 H50 Q46 50 46 46 V22 Q46 18 50 18 Z"/>
        <path d="M58 40 Q68 34 78 40 Q88 46 100 38"/>
        <circle cx="100" cy="38" r="2.2" fill="currentColor" stroke="none"/>
        <circle cx="58" cy="40" r="1.8" fill="currentColor" stroke="none"/>
        <path d="M112 18.5 Q113.2 19.8 115.5 21 Q113.2 22.2 112 23.5 Q110.8 22.2 108.5 21 Q110.8 19.8 112 18.5 Z"/>
      </g>
      <g *ngSwitchCase="'replace-excel'">
        <path d="M54 18 H108 V48 H54 Z"/>
        <path d="M54 30 H108"/>
        <path d="M74 30 V48"/>
        <path d="M92 30 V48"/>
        <path d="M64 44 V36 M74 44 V41 M84 44 V33 M94 44 V39 M104 44 V35"/>
        <path d="M116 46 L124 38 L132 40 L140 30"/>
        <circle cx="140" cy="30" r="2" fill="currentColor" stroke="none"/>
      </g>
      <g *ngSwitchCase="'replace-google'">
        <circle cx="58" cy="28" r="15"/>
        <path d="M69 39 L90 60"/>
        <path d="M104 20 H132 V46 H104 Z"/>
        <path d="M110 27 H138 V53 H110 Z"/>
        <path d="M116 34 H132"/>
        <path d="M116 40 H132"/>
        <path d="M116 46 H126"/>
        <path d="M48 6.5 Q49.2 7.8 51.5 9 Q49.2 10.2 48 11.5 Q46.8 10.2 44.5 9 Q46.8 7.8 48 6.5 Z"/>
      </g>
      <g *ngSwitchCase="'open-source-self-hosted'">
        <path d="M24 16 H58 V46 H24 Z"/>
        <path d="M30 24 H52"/>
        <path d="M30 32 H52"/>
        <path d="M30 40 H52"/>
        <circle cx="52" cy="20" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M58 30 H72"/>
        <circle cx="72" cy="30" r="3"/>
        <path d="M72 27 V22"/>
        <circle cx="72" cy="18" r="2.5"/>
        <path d="M72 33 V40"/>
        <circle cx="72" cy="44" r="2.5"/>
        <path d="M75 30 H86"/>
        <circle cx="90" cy="30" r="2.5"/>
        <path d="M90 27 V24 L100 21"/>
        <circle cx="104" cy="18" r="2.5"/>
        <path d="M90 33 V36 L100 39"/>
        <circle cx="104" cy="42" r="2.5"/>
        <path d="M128 10.5 Q129.2 11.8 131.5 13 Q129.2 14.2 128 15.5 Q126.8 14.2 124.5 13 Q126.8 11.8 128 10.5 Z"/>
      </g>
    </svg>
  `,
  styles: [`
    .collection-art {
      display: block;
      width: 56%;
      height: auto;
      margin: 0 auto;
      opacity: 0.92;
    }
  `]
})
export class CollectionArtComponent {
  @Input() slug = '';
  @Input() color = '#6366f1';

  private titles: Record<string, string> = {
    agents: 'Best AI Agents illustration',
    students: 'Best AI for Students illustration',
    developers: 'Best AI for Developers illustration',
    'free-ai': 'Best Free AI illustration',
    'replace-photoshop': 'Replace Photoshop illustration',
    'replace-canva': 'Replace Canva illustration',
    'replace-excel': 'Replace Excel illustration',
    'replace-google': 'Replace Google illustration',
    'open-source-self-hosted': 'Open Source & self-hosted illustration'
  };

  get artTitle(): string {
    return this.titles[this.slug] || 'Collection illustration';
  }
}
