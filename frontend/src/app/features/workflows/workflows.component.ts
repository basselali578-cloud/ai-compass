import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Workflow } from '../../core/models/api.models';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { ToolLogoComponent } from '../../shared/components/tool-logo/tool-logo.component';

@Component({
  selector: 'app-workflows',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonCardComponent, ToolLogoComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Workflows</h1>
        <p>The best tools only help if you know the order. Follow a tested stack from idea to done.</p>
      </div>

      <ng-container *ngIf="!loading && !error">
        <div class="section-head" *ngIf="featured.length">
          <h2>Starter stacks <span class="head-note">curated by hand</span></h2>
          <a routerLink="/collections" class="muted-link">Prefer one-tool lists? Browse collections <i class="pi pi-arrow-right"></i></a>
        </div>
        <div class="workflow-grid">
          <a *ngFor="let w of featured" [routerLink]="['/workflows', w.slug]" class="workflow-card" [style.borderColor]="w.color + '44'">
            <div class="card-top">
              <div class="wf-icon" [style.background]="w.color + '22'" [style.color]="w.color">
                <i class="pi {{ w.icon }}"></i>
              </div>
              <span class="featured-chip" [style.background]="w.color + '22'" [style.color]="w.color"><i class="pi pi-star-fill"></i> Starter</span>
            </div>
            <h3>{{ w.title }}</h3>
            <p class="goal">{{ w.goal }}</p>
            <p class="summary">{{ w.summary }}</p>
            <div class="card-foot">
              <span class="preview" *ngIf="w.preview?.length">
                <app-tool-logo *ngFor="let t of w.preview" [name]="t.name" [size]="26"></app-tool-logo>
              </span>
              <span class="meta"><i class="pi pi-arrow-right-arrow-left"></i> {{ w.step_count }} steps</span>
              <span class="meta" *ngIf="w.estimated_minutes"><i class="pi pi-clock"></i> ~{{ w.estimated_minutes }} min</span>
            </div>
          </a>
        </div>

        <div class="section-head" *ngIf="all.length">
          <h2>All workflows</h2>
        </div>
        <div class="workflow-grid" *ngIf="all.length">
          <a *ngFor="let w of all" [routerLink]="['/workflows', w.slug]" class="workflow-card" [style.borderColor]="w.color + '44'">
            <div class="card-top">
              <div class="wf-icon" [style.background]="w.color + '22'" [style.color]="w.color">
                <i class="pi {{ w.icon }}"></i>
              </div>
            </div>
            <h3>{{ w.title }}</h3>
            <p class="goal">{{ w.goal }}</p>
            <p class="summary">{{ w.summary }}</p>
            <div class="card-foot">
              <span class="preview" *ngIf="w.preview?.length">
                <app-tool-logo *ngFor="let t of w.preview" [name]="t.name" [size]="26"></app-tool-logo>
              </span>
              <span class="meta"><i class="pi pi-arrow-right-arrow-left"></i> {{ w.step_count }} steps</span>
              <span class="meta" *ngIf="w.estimated_minutes"><i class="pi pi-clock"></i> ~{{ w.estimated_minutes }} min</span>
            </div>
          </a>
        </div>
      </ng-container>

      <div class="workflow-grid" *ngIf="loading">
        <app-skeleton-card variant="workflow" *ngFor="let s of [0,1,2,3,4,5]" [attr.aria-hidden]="true"></app-skeleton-card>
      </div>

      <div class="error-state" *ngIf="error">
        <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
        <h3>Couldn't load workflows</h3>
        <button class="btn btn-primary" (click)="load()"><i class="pi pi-refresh"></i> Try again</button>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && workflows.length === 0">
        <div class="state-icon"><i class="pi pi-sitemap"></i></div>
        <h3>No workflows yet</h3>
        <p>We're hand-testing our first stacks. Check back soon.</p>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }
    .page-header { margin-bottom: 2.25rem; }
    .page-header h1 { color: var(--text-1); font-size: clamp(1.7rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .page-header p { color: var(--text-2); font-size: 0.95rem; max-width: 560px; line-height: 1.6; }
    .section-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      margin: 2rem 0 1.1rem;
    }
    .section-head h2 { color: var(--text-1); font-size: 1.15rem; font-weight: 700; }
    .head-note { color: var(--text-3); font-size: 0.8rem; font-weight: 500; }
    .muted-link { color: var(--text-3); text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.4rem; transition: color 0.18s var(--ease), gap 0.2s var(--ease); }
    .muted-link:hover { color: var(--primary); gap: 0.6rem; }
    .workflow-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-5); }
    .workflow-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), background 0.2s var(--ease), border-color 0.2s var(--ease);
    }
    .workflow-card:hover {
      background: var(--surface-2);
      transform: translateY(-3px);
      box-shadow: var(--shadow-lift);
      border-color: var(--primary);
    }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; gap: 1rem; }
    .wf-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
    }
    .featured-chip {
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: var(--radius-full);
      padding: 0.3rem 0.65rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      white-space: nowrap;
    }
    .featured-chip i { font-size: 0.65rem; }
    .workflow-card h3 { color: var(--text-1); font-size: 1.1rem; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 0.4rem; }
    .goal { color: #a5b4fc; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.6rem; }
    .summary { color: var(--text-2); font-size: 0.85rem; line-height: 1.55; margin-bottom: 1.25rem; flex: 1; }
    .card-foot {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .preview { display: flex; gap: 0.25rem; margin-right: auto; }
    .meta { color: var(--text-3); font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem; white-space: nowrap; }
    .meta i { font-size: 0.75rem; }
    .error-state h3 { color: var(--text-1); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; }
    @media (max-width: 640px) { .workflow-grid { grid-template-columns: 1fr; } }
  `]
})
export class WorkflowsComponent implements OnInit {
  workflows: Workflow[] = [];
  featured: Workflow[] = [];
  all: Workflow[] = [];
  loading = true;
  error = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.api.getWorkflows().subscribe({
      next: res => {
        this.workflows = res.data;
        this.featured = res.data.filter(w => w.is_featured);
        this.all = res.data.filter(w => !w.is_featured);
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }
}
