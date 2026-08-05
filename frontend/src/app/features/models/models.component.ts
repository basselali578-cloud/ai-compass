import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AiModel } from '../../core/models/api.models';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { ToolLogoComponent } from '../../shared/components/tool-logo/tool-logo.component';

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    SkeletonCardComponent,
    ToolLogoComponent
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>AI models, explained simply</h1>
        <p>No jargon. Just what each model is good at and whether you can run it yourself.</p>
      </div>

      <div class="search-wrap">
        <span class="search-field">
          <i class="pi pi-search"></i>
          <input pInputText [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="e.g. coding, runs on my laptop..." class="search-input" aria-label="Search models">
        </span>
      </div>

      <div class="filter-chips" role="group" aria-label="Filter models">
        <button class="chip" [class.active]="localOnly" (click)="toggleLocal()"><i class="pi pi-desktop"></i> Runs locally</button>
        <button class="chip" [class.active]="freeOnly" (click)="toggleFree()"><i class="pi pi-gift"></i> Free</button>
        <button class="chip" [class.active]="paidOnly" (click)="togglePaid()"><i class="pi pi-wallet"></i> Paid</button>
        <button class="chip" [class.active]="apiOnly" (click)="toggleApi()"><i class="pi pi-globe"></i> Has API</button>
        <button class="chip" [class.active]="openRouterOnly" (click)="toggleOpenRouter()"><i class="pi pi-share-alt"></i> On OpenRouter</button>
      </div>

      <div class="models-grid" *ngIf="!loading && !error">
        <div
          *ngFor="let model of filteredModels"
          class="model-card"
          role="button"
          tabindex="0"
          (click)="openDialog(model)"
          (keydown.enter)="openDialog(model)">
          <div class="card-top">
            <app-tool-logo [name]="model.name" [size]="48"></app-tool-logo>
            <p-tag [value]="model.provider" severity="info"></p-tag>
          </div>
          <h3>{{ model.name }}</h3>
          <p class="best-for" *ngIf="model.best_for"><i class="pi pi-star"></i> {{ model.best_for }}</p>
          <p class="desc">{{ model.description }}</p>
          <div class="plain-tags">
            <span class="plain-tag" *ngIf="model.runs_locally"><i class="pi pi-desktop"></i> Runs locally</span>
            <span class="plain-tag warn" *ngIf="model.requires_gpu"><i class="pi pi-microchip"></i> Needs GPU</span>
            <span class="plain-tag green" *ngIf="model.is_free"><i class="pi pi-dollar"></i> Free</span>
            <span class="plain-tag blue" *ngIf="model.has_api"><i class="pi pi-globe"></i> API</span>
            <span class="plain-tag purple" *ngIf="model.on_openrouter"><i class="pi pi-share-alt"></i> OpenRouter</span>
          </div>
        </div>
      </div>

      <div class="models-grid" *ngIf="loading">
        <app-skeleton-card variant="model" *ngFor="let s of [0,1,2,3,4,5]" [attr.aria-hidden]="true"></app-skeleton-card>
      </div>

      <div class="error-state" *ngIf="error">
        <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
        <h3>Couldn't load models</h3>
        <button class="btn btn-primary" (click)="loadModels()"><i class="pi pi-refresh"></i> Try again</button>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && filteredModels.length === 0">
        <div class="state-icon"><i class="pi pi-cpu"></i></div>
        <h3>No models match</h3>
        <p>Try removing a filter or a different search term.</p>
      </div>

      <p-dialog [(visible)]="dialogVisible" [modal]="true" [style]="{width: '600px', maxHeight: '85vh'}" [draggable]="false">
        <div *ngIf="selectedModel" class="dialog-content">
          <div class="dialog-title">
            <app-tool-logo [name]="selectedModel.name" [size]="52"></app-tool-logo>
            <div>
              <h2>{{ selectedModel.name }}</h2>
              <p-tag [value]="selectedModel.provider" severity="info"></p-tag>
            </div>
          </div>
          <p class="dialog-desc">{{ selectedModel.description }}</p>
          <p class="dialog-best-for" *ngIf="selectedModel.best_for"><i class="pi pi-star"></i> Best for: {{ selectedModel.best_for }}</p>

          <div class="plain-tags dialog-plain">
            <span class="plain-tag" *ngIf="selectedModel.runs_locally"><i class="pi pi-desktop"></i> Runs locally</span>
            <span class="plain-tag warn" *ngIf="selectedModel.requires_gpu"><i class="pi pi-microchip"></i> Needs GPU</span>
            <span class="plain-tag green" *ngIf="selectedModel.is_free"><i class="pi pi-gift"></i> Free</span>
            <span class="plain-tag" *ngIf="!selectedModel.is_free"><i class="pi pi-wallet"></i> Paid</span>
            <span class="plain-tag blue" *ngIf="selectedModel.has_api"><i class="pi pi-globe"></i> API available</span>
            <span class="plain-tag purple" *ngIf="selectedModel.on_openrouter"><i class="pi pi-share-alt"></i> OpenRouter</span>
          </div>

          <div class="dialog-section" *ngIf="selectedModel.alternatives && selectedModel.alternatives.length">
            <h4><i class="pi pi-sitemap" style="color:#6366f1"></i> Good alternatives</h4>
            <div class="alt-tags">
              <button class="alt-tag" *ngFor="let a of selectedModel.alternatives" (click)="openAlt(a)" [attr.aria-label]="'Open ' + a">
                {{ a }} <i class="pi pi-arrow-right"></i>
              </button>
            </div>
          </div>

          <div class="advanced">
            <h4>Advanced specs</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Parameters</span>
                <span class="value">{{ selectedModel.parameters }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Framework</span>
                <span class="value">{{ selectedModel.framework }}</span>
              </div>
              <div class="detail-item">
                <span class="label">License</span>
                <span class="value">{{ selectedModel.license }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Downloads</span>
                <span class="value">{{ formatNumber(selectedModel.downloads) }}</span>
              </div>
            </div>
          </div>
        </div>
        <ng-template #footer>
          <a [href]="selectedModel?.url" target="_blank" rel="noopener" pButton label="View on HuggingFace" icon="pi pi-external-link"></a>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { color: var(--text-1); font-size: clamp(1.7rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .page-header p { color: var(--text-2); font-size: 0.95rem; }
    .search-wrap { margin-bottom: 1rem; }
    .search-field { position: relative; display: inline-block; width: 100%; max-width: 640px; }
    .search-field > .pi-search { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-3); font-size: 0.95rem; pointer-events: none; }
    .search-input {
      background: var(--surface-1);
      border: 1px solid var(--border);
      color: var(--text-1);
      padding: 0.9rem 1rem 0.9rem 2.75rem;
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      width: 100%;
      transition: border-color 0.18s var(--ease), box-shadow 0.18s var(--ease);
    }
    .search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.16); outline: none; }
    .filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .models-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-5); }
    .model-card {
      background: var(--surface-1);
      border-radius: 14px;
      padding: 1.5rem;
      border: 1px solid var(--border);
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }
    .model-card:hover { background: var(--surface-2); }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .model-card h3 { color: var(--text-1); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .best-for { color: #a5b4fc; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.375rem; }
    .best-for i { color: var(--primary); font-size: 0.75rem; }
    .desc {
      color: var(--text-2);
      font-size: 0.85rem;
      line-height: 1.55;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .plain-tags { display: flex; gap: 0.375rem; flex-wrap: wrap; margin-top: auto; }
    .plain-tag {
      font-size: 0.72rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      padding: 0.3rem 0.625rem;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: #cbd5e1;
      background: var(--border);
      transition: transform 0.18s var(--ease);
    }
    .plain-tag i { font-size: 0.7rem; }
    .plain-tag.warn { color: #fbbf24; background: rgba(251,191,36,0.12); }
    .plain-tag.green { color: #34d399; background: rgba(52,211,153,0.12); }
    .plain-tag.blue { color: #60a5fa; background: rgba(96,165,250,0.12); }
    .plain-tag.purple { color: #a78bfa; background: rgba(167,139,250,0.12); }
    .dialog-title { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
    .dialog-title h2 { color: var(--text-1); margin: 0 0 0.5rem; font-size: 1.35rem; letter-spacing: -0.02em; }
    .dialog-desc { color: var(--text-2); line-height: 1.7; margin-bottom: 1rem; }
    .dialog-best-for { color: #a5b4fc; font-weight: 500; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.375rem; }
    .dialog-best-for i { color: var(--primary); font-size: 0.8rem; }
    .dialog-plain { margin-bottom: 1.5rem; }
    .dialog-section { margin-bottom: 1.5rem; }
    .dialog-section h4 { color: #e2e8f0; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.625rem; display: flex; align-items: center; gap: 0.5rem; }
    .alt-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
    .alt-tag {
      background: var(--primary-soft);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #c7d2fe;
      border-radius: var(--radius-full);
      padding: 0.35rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.18s var(--ease);
    }
    .alt-tag:hover { border-color: var(--primary); color: #fff; transform: translateY(-1px); }
    .alt-tag i { font-size: 0.7rem; color: var(--primary); }
    .advanced h4 { color: #e2e8f0; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.875rem; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
    .detail-item { background: var(--bg); border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-sm); }
    .detail-item .label { color: var(--text-3); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; }
    .detail-item .value { color: var(--text-1); font-weight: 600; font-size: 1rem; }
    @media (max-width: 640px) {
      .models-grid { grid-template-columns: 1fr; }
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ModelsComponent implements OnInit {
  models: AiModel[] = [];
  filteredModels: AiModel[] = [];
  searchTerm = '';
  localOnly = false;
  freeOnly = false;
  paidOnly = false;
  apiOnly = false;
  openRouterOnly = false;
  loading = true;
  error = false;
  dialogVisible = false;
  selectedModel: AiModel | null = null;

  constructor(private api: ApiService, private message: MessageService) {}

  ngOnInit(): void {
    this.loadModels();
  }

  loadModels(): void {
    this.loading = true;
    this.error = false;
    this.api.getModels(1, 50).subscribe({
      next: res => {
        this.models = res.data;
        this.loading = false;
        this.applyFilters();
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  applyFilters(): void {
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredModels = this.models.filter(m => {
      const matchesSearch = !q
        || m.name.toLowerCase().includes(q)
        || (m.provider || '').toLowerCase().includes(q)
        || (m.best_for || '').toLowerCase().includes(q)
        || (m.description || '').toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (this.localOnly && !m.runs_locally) return false;
      if (this.freeOnly && !m.is_free) return false;
      if (this.paidOnly && m.is_free) return false;
      if (this.apiOnly && !m.has_api) return false;
      if (this.openRouterOnly && !m.on_openrouter) return false;
      return true;
    });
  }

  toggleLocal(): void { this.localOnly = !this.localOnly; this.applyFilters(); }
  toggleFree(): void {
    this.freeOnly = !this.freeOnly;
    if (this.freeOnly) this.paidOnly = false;
    this.applyFilters();
  }
  togglePaid(): void {
    this.paidOnly = !this.paidOnly;
    if (this.paidOnly) this.freeOnly = false;
    this.applyFilters();
  }
  toggleApi(): void { this.apiOnly = !this.apiOnly; this.applyFilters(); }
  toggleOpenRouter(): void { this.openRouterOnly = !this.openRouterOnly; this.applyFilters(); }

  onSearch(): void {
    this.applyFilters();
  }

  openDialog(model: AiModel): void {
    this.selectedModel = model;
    this.dialogVisible = true;
  }

  openAlt(name: string): void {
    const found = this.models.find(m => m.name.toLowerCase() === name.toLowerCase());
    if (found) {
      this.openDialog(found);
      return;
    }
    this.message.add({
      severity: 'info',
      summary: 'Not in the catalog yet',
      detail: `${name} isn't in our catalog yet — we'll add it soon.`
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
