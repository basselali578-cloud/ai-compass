import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="brand-mark"><i class="pi pi-compass"></i></div>
            <div>
              <span class="brand-name">AI Compass</span>
              <p>The fastest way to find the right AI tool for the job.</p>
            </div>
          </div>

          <div class="footer-col">
            <h4>Explore</h4>
            <a routerLink="/tools">AI Tools</a>
            <a routerLink="/collections">Collections</a>
            <a routerLink="/workflows">Workflows</a>
            <a routerLink="/models">Models</a>
          </div>

          <div class="footer-col">
            <h4>Your stuff</h4>
            <a routerLink="/saved">Saved tools</a>
            <a routerLink="/auth/login">Log in</a>
            <a routerLink="/auth/register">Create account</a>
          </div>

          <div class="footer-col">
            <h4>Why trust us</h4>
            <p class="trust-line"><i class="pi pi-check-circle"></i> Every tool tested by a human editor</p>
            <p class="trust-line"><i class="pi pi-sync"></i> Refreshed weekly — stale picks removed</p>
            <p class="trust-line"><i class="pi pi-shield"></i> No sponsored listings. Ever.</p>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; 2026 AI Compass. Made for curious builders.</span>
          <span class="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
            <a href="https://openrouter.ai" target="_blank" rel="noopener">OpenRouter</a>
            <a href="https://huggingface.co" target="_blank" rel="noopener">Hugging Face</a>
          </span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-deep);
      border-top: 1px solid var(--border);
      margin-top: 4rem;
    }
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem 1.5rem;
    }
    .footer-top {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
      gap: 2.5rem;
      padding-bottom: 2.5rem;
    }
    .footer-brand { display: flex; gap: 0.9rem; align-items: flex-start; }
    .brand-mark {
      width: 40px; height: 40px;
      border-radius: 11px;
      background: var(--primary);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 1.15rem;
      box-shadow: var(--shadow-sm);
      flex-shrink: 0;
    }
    .brand-name { color: var(--text-1); font-weight: 700; font-size: 1.1rem; }
    .footer-brand p { color: var(--text-3); font-size: 0.85rem; line-height: 1.6; margin-top: 0.4rem; max-width: 260px; }
    .footer-col h4 {
      color: var(--text-2);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 1rem;
    }
    .footer-col a {
      display: block;
      color: var(--text-3);
      text-decoration: none;
      font-size: 0.875rem;
      padding: 0.3rem 0;
      transition: color 0.18s var(--ease), transform 0.18s var(--ease);
    }
    .footer-col a:hover { color: var(--primary); transform: translateX(2px); }
    .trust-line {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      color: var(--text-3);
      font-size: 0.85rem;
      line-height: 1.5;
      margin-bottom: 0.55rem;
    }
    .trust-line i { color: var(--primary); margin-top: 0.15rem; }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      border-top: 1px solid var(--border);
      padding-top: 1.25rem;
      color: var(--text-3);
      font-size: 0.78rem;
    }
    .footer-links { display: flex; gap: 1.25rem; }
    .footer-links a { color: var(--text-3); text-decoration: none; transition: color 0.18s var(--ease); }
    .footer-links a:hover { color: var(--primary); }
    @media (max-width: 860px) {
      .footer-top { grid-template-columns: 1fr 1fr; }
      .footer-brand { grid-column: 1 / -1; }
    }
    @media (max-width: 480px) {
      .footer-top { grid-template-columns: 1fr; gap: 1.75rem; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
  `]
})
export class FooterComponent {}
