import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Collection } from '../../core/models/api.models';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { CollectionArtComponent } from '../../shared/components/collection-art/collection-art.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonCardComponent, CollectionArtComponent],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Collections</h1>
        <p>Done-for-you shortlists for specific people and jobs. Curated by hand, not scraped.</p>
      </div>

      <div class="collection-grid" *ngIf="!loading && !error">
        <a *ngFor="let collection of collections" [routerLink]="['/collections', collection.slug]" class="collection-card">
          <div class="collection-cover" [style.background]="collection.color + '12'">
            <app-collection-art [slug]="collection.slug" [color]="collection.color"></app-collection-art>
          </div>
          <div class="collection-body">
            <h3>{{ collection.title }}</h3>
            <p>{{ collection.description }}</p>
            <span class="collection-count" [style.color]="collection.color">{{ collection.tool_count }} tools <i class="pi pi-arrow-right"></i></span>
          </div>
        </a>
      </div>

      <div class="collection-grid" *ngIf="loading">
        <app-skeleton-card variant="collection" *ngFor="let s of [0,1,2,3,4,5]" [attr.aria-hidden]="true"></app-skeleton-card>
      </div>

      <div class="error-state" *ngIf="error">
        <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
        <h3>Couldn't load collections</h3>
        <button class="btn btn-primary" (click)="load()"><i class="pi pi-refresh"></i> Try again</button>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && collections.length === 0">
        <div class="state-icon"><i class="pi pi-inbox"></i></div>
        <h3>No collections yet</h3>
        <p>We're still putting these together. Check back soon.</p>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { color: var(--text-1); font-size: clamp(1.7rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .page-header p { color: var(--text-2); font-size: 0.95rem; }
    .collection-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-5); }
    .collection-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 14px;
      text-decoration: none;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s var(--ease), border-color 0.2s var(--ease), box-shadow 0.22s var(--ease), background 0.2s var(--ease);
    }
    .collection-card:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow-md); }
    .collection-cover {
      height: 92px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--border);
    }
    .collection-body { padding: 1.25rem 1.5rem 1.5rem; }
    .collection-card h3 { color: var(--text-1); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .collection-card p { color: var(--text-2); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; }
    .collection-count { color: var(--text-3); font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; transition: gap 0.2s var(--ease); }
    .collection-card:hover .collection-count { gap: 0.75rem; }
    @media (max-width: 640px) { .collection-grid { grid-template-columns: 1fr; } }
  `]
})
export class CollectionsComponent implements OnInit {
  collections: Collection[] = [];
  loading = true;
  error = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.api.getCollections().subscribe({
      next: res => { this.collections = res.data; this.loading = false; },
      error: () => { this.loading = false; this.error = true; }
    });
  }
}
