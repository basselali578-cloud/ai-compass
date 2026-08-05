import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CollectionDetail, Tool } from '../../core/models/api.models';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { ToolLogoComponent } from '../../shared/components/tool-logo/tool-logo.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TagModule,
    DialogModule,
    TooltipModule,
    SkeletonCardComponent,
    ToolLogoComponent
  ],
  template: `
    <div class="container">
      <a routerLink="/collections" class="back-link"><i class="pi pi-arrow-left"></i> All collections</a>

      <ng-container *ngIf="collection && !loading && !error">
        <div class="hero" [style.borderColor]="collection.color">
          <div class="hero-icon" [style.background]="collection.color + '22'" [style.color]="collection.color">
            <i class="pi {{ collection.icon }}"></i>
          </div>
          <div class="hero-text">
            <h1>{{ collection.title }}</h1>
            <p>{{ collection.description }}</p>
            <span class="hero-count" [style.color]="collection.color">{{ collection.tool_count }} tools, curated by hand</span>
          </div>
        </div>

        <div class="tools-grid">
          <div
            *ngFor="let tool of tools"
            class="tool-card"
            role="button"
            tabindex="0"
            (click)="openTool(tool)"
            (keydown.enter)="openTool(tool)">
            <div class="card-top">
              <app-tool-logo [name]="tool.name" [size]="48"></app-tool-logo>
              <div class="card-actions">
                <span class="new-badge" *ngIf="tool.is_new"><i class="pi pi-sparkles"></i> New</span>
                <button
                  class="save-btn"
                  [class.saved]="savedIds.has(tool.id)"
                  [attr.aria-label]="savedIds.has(tool.id) ? 'Remove from saved' : 'Save for later'"
                  [pTooltip]="savedIds.has(tool.id) ? 'Remove from saved' : 'Save for later'"
                  tooltipPosition="top"
                  (click)="toggleSave(tool, $event)">
                  <i class="pi" [ngClass]="savedIds.has(tool.id) ? 'pi-bookmark-fill' : 'pi-bookmark'"></i>
                </button>
              </div>
            </div>
            <h3>{{ tool.name }}</h3>
            <p class="best-for">{{ tool.best_for }}</p>
            <div class="card-tags">
              <p-tag [value]="tool.pricing" [severity]="pricingSeverity(tool.pricing)"></p-tag>
              <p-tag *ngIf="tool.beginner_friendly" value="Beginner friendly" severity="info"></p-tag>
            </div>
          </div>
        </div>
      </ng-container>

      <div class="tools-grid" *ngIf="loading">
        <app-skeleton-card variant="tool" *ngFor="let s of [0,1,2,3]" [attr.aria-hidden]="true"></app-skeleton-card>
      </div>

      <div class="error-state" *ngIf="error">
        <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
        <h3>Couldn't load this collection</h3>
        <button class="btn btn-primary" (click)="load()"><i class="pi pi-refresh"></i> Try again</button>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && !collection">
        <div class="state-icon"><i class="pi pi-inbox"></i></div>
        <h3>Collection not found</h3>
        <p>This collection may have been renamed or removed.</p>
        <a routerLink="/collections" class="btn btn-primary">Browse collections <i class="pi pi-arrow-right"></i></a>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
    .back-link { color: var(--text-2); text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; transition: color 0.18s var(--ease), gap 0.2s var(--ease); }
    .back-link:hover { color: var(--primary); gap: 0.75rem; }
    .hero {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 50px -25px rgba(0,0,0,.6);
    }
    .hero-icon {
      width: 56px; height: 56px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .hero-text h1 { color: var(--text-1); font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .hero-text p { color: var(--text-2); font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.5rem; }
    .hero-count { font-size: 0.8rem; font-weight: 600; }
    .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-5); }
    .tool-card {
      background: var(--surface-1);
      border-radius: 14px;
      padding: 1.5rem;
      border: 1px solid var(--border);
      cursor: pointer;
    }
    .tool-card:hover { background: var(--surface-2); }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .card-actions { display: flex; align-items: center; gap: 0.5rem; }
    .new-badge {
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 999px;
      padding: 0.25rem 0.6rem;
      color: #a855f7;
      background: rgba(168,85,247,0.12);
    }
    .save-btn {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-2);
      cursor: pointer;
      transition: all 0.2s var(--ease);
    }
    .save-btn:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); }
    .save-btn.saved { background: var(--primary); border-color: var(--primary); color: white; box-shadow: 0 4px 12px -4px var(--primary-glow); }
    .tool-card h3 { color: var(--text-1); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.375rem; }
    .best-for { color: #a5b4fc; font-size: 0.875rem; font-weight: 500; margin-bottom: 1rem; }
    .card-tags { display: flex; gap: 0.375rem; flex-wrap: wrap; }
    @media (max-width: 640px) {
      .hero { flex-direction: column; }
      .tools-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CollectionComponent implements OnInit {
  collection: CollectionDetail | null = null;
  tools: Tool[] = [];
  savedIds = new Set<number>();
  loading = true;
  error = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => this.load());
    if (this.auth.isLoggedIn) {
      this.api.getSavedTools().subscribe(res => {
        this.savedIds = new Set(res.data.map(s => s.id));
      });
    }
  }

  load(): void {
    this.loading = true;
    this.error = false;
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) { this.loading = false; return; }
    this.api.getCollectionBySlug(slug).subscribe({
      next: res => {
        this.collection = res;
        this.tools = res.tools;
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }

  toggleSave(tool: Tool, event?: MouseEvent): void {
    event?.stopPropagation();
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.savedIds.has(tool.id)) {
      this.api.unsaveTool(tool.id).subscribe(() => {
        this.savedIds.delete(tool.id);
        this.message.add({ severity: 'success', summary: 'Removed', detail: `${tool.name} was removed from your saved tools.` });
      });
    } else {
      this.api.saveTool(tool.id).subscribe(() => {
        this.savedIds.add(tool.id);
        this.message.add({ severity: 'success', summary: 'Saved', detail: `${tool.name} is now in your saved tools.` });
      });
    }
  }

  openTool(tool: Tool): void {
    this.router.navigate(['/tools'], { queryParams: { id: tool.id } });
  }

  pricingSeverity(p: string): 'success' | 'warn' | 'danger' | 'info' {
    return p === 'Free' ? 'success' : p === 'Freemium' ? 'warn' : p === 'Paid' ? 'info' : 'info';
  }
}
