import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CompassMarkComponent } from '../compass-mark/compass-mark.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CompassMarkComponent],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="navbar-container">
        <a routerLink="/" class="navbar-brand" (click)="closeMenu()" aria-label="AI Compass home">
          <span class="brand-mark"><app-compass-mark [size]="22" [light]="true" [angle]="0"></app-compass-mark></span>
          <span>AI Compass</span>
        </a>

        <div class="navbar-links" [class.open]="menuOpen" id="main-nav">
          <a routerLink="/tools" routerLinkActive="active" (click)="closeMenu()">Tools</a>
          <a routerLink="/collections" routerLinkActive="active" (click)="closeMenu()">Collections</a>
          <a routerLink="/workflows" routerLinkActive="active" (click)="closeMenu()">Workflows</a>
          <a routerLink="/models" routerLinkActive="active" (click)="closeMenu()">Models</a>
          <a routerLink="/saved" routerLinkActive="active" class="saved-link" (click)="closeMenu()">
            <i class="pi pi-bookmark"></i> Saved
          </a>
        </div>

        <div class="navbar-actions">
          <button
            class="theme-toggle"
            (click)="theme.toggle()"
            [attr.aria-label]="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            [title]="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <i class="pi" [ngClass]="theme.isDark ? 'pi-sun' : 'pi-moon'"></i>
          </button>
          <ng-container *ngIf="auth.isLoggedIn; else loggedOut">
            <span class="user-greeting">Hi, {{ (auth.currentUser$ | async)?.username }}</span>
            <button class="btn btn-ghost btn-sm" (click)="logout()">Log out</button>
          </ng-container>
          <ng-template #loggedOut>
            <a routerLink="/auth/login" class="btn btn-ghost btn-sm nav-cta">Log in</a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm nav-cta">Sign up</a>
          </ng-template>
          <button
            class="hamburger"
            [attr.aria-expanded]="menuOpen"
            aria-label="Toggle navigation"
            (click)="menuOpen = !menuOpen">
            <i class="pi" [ngClass]="menuOpen ? 'pi-times' : 'pi-bars'"></i>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--nav-bg);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
      transition: border-color 0.25s var(--ease), box-shadow 0.25s var(--ease);
    }
    .navbar.scrolled { border-bottom-color: var(--border-strong); box-shadow: var(--shadow-sm); }
    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      gap: 1rem;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: var(--text-1);
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .brand-mark {
      width: 34px; height: 34px;
      border-radius: 10px;
      background: var(--primary);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow-sm);
    }
    .navbar-links { display: flex; gap: 0.25rem; align-items: center; }
    .navbar-links a {
      color: var(--text-2);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.92rem;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      transition: color 0.18s var(--ease), background 0.18s var(--ease);
    }
    .navbar-links a:hover { color: var(--text-1); background: var(--primary-soft); }
    .navbar-links a.active { color: var(--primary); background: var(--primary-soft); }
    .saved-link { display: inline-flex; align-items: center; gap: 0.35rem; }
    .navbar-actions { display: flex; align-items: center; gap: 0.6rem; }
    .user-greeting { color: var(--text-2); font-size: 0.85rem; white-space: nowrap; }
    .btn-sm { padding: 0.45rem 0.95rem; font-size: 0.85rem; border-radius: 8px; }
    .theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 38px; height: 38px;
      color: var(--text-2);
      transition: color 0.2s var(--ease), border-color 0.2s var(--ease), background 0.2s var(--ease);
    }
    .theme-toggle:hover { color: var(--primary); border-color: var(--primary); background: var(--primary-soft); }
    .theme-toggle i { font-size: 0.95rem; }
    .hamburger {
      display: none;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 38px; height: 38px;
      color: var(--text-1);
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s var(--ease);
    }
    .hamburger:hover { border-color: var(--primary); }
    @media (max-width: 860px) {
      .navbar-links {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        gap: 0.25rem;
        background: var(--nav-bg-solid);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--border);
        padding: 0.75rem 1rem 1rem;
        display: none;
      }
      .navbar-links.open { display: flex; animation: navDrop 0.22s var(--ease); }
      .navbar-links a { padding: 0.85rem 1rem; font-size: 1rem; }
      .nav-cta { display: none; }
      .hamburger { display: flex; }
    }
    @keyframes navDrop {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NavbarComponent {
  menuOpen = false;
  scrolled = false;

  constructor(public auth: AuthService, public theme: ThemeService) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  private onScroll = (): void => {
    this.scrolled = (window.scrollY || 0) > 8;
  };

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
  }
}
