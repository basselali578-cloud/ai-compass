import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Tool, UseCase } from '../../core/models/api.models';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { ToolLogoComponent } from '../../shared/components/tool-logo/tool-logo.component';
import { CompassMarkComponent } from '../../shared/components/compass-mark/compass-mark.component';

@Component({
  selector: 'app-tools',
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
    ToolLogoComponent,
    CompassMarkComponent
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Find your tool</h1>
        <p>Describe the job. We'll shortlist the right tools — curated, not scraped.</p>
      </div>

      <div class="search-wrap">
        <span class="search-field">
          <i class="pi pi-search"></i>
          <input
            [(ngModel)]="searchTerm"
            (ngModelChange)="onTermChange($event)"
            placeholder='Try "I need an AI to remove backgrounds"...'
            class="search-input"
            aria-label="Search tools by what you want to do">
          <app-compass-mark class="search-compass" *ngIf="searching" [size]="20" [loading]="true" [angle]="0"></app-compass-mark>
        </span>
        <button class="clear-search" *ngIf="searchTerm" (click)="clearSearch()" aria-label="Clear search">Clear <i class="pi pi-times"></i></button>
      </div>

      <div class="pricing-chips" role="group" aria-label="Filter tools by price">
        <button class="chip" [class.active]="pricingFilter === 'All'" (click)="setPricing('All')"><i class="pi pi-th-large"></i> All</button>
        <button class="chip" [class.active]="pricingFilter === 'Free'" (click)="setPricing('Free')"><i class="pi pi-gift"></i> Free</button>
        <button class="chip" [class.active]="pricingFilter === 'Freemium'" (click)="setPricing('Freemium')"><i class="pi pi-star"></i> Freemium</button>
        <button class="chip" [class.active]="pricingFilter === 'Paid'" (click)="setPricing('Paid')"><i class="pi pi-wallet"></i> Paid</button>
      </div>

      <div class="tabs" *ngIf="!searchTerm" role="tablist" aria-label="Browse tools">
        <button class="tab" [class.active]="viewMode === 'all'" (click)="setView('all')">All tools</button>
        <button class="tab" [class.active]="viewMode === 'trending'" (click)="setView('trending')">Trending this week</button>
        <button class="tab" [class.active]="viewMode === 'new'" (click)="setView('new')">New this week</button>
        <button class="tab" [class.active]="viewMode === 'gems'" (click)="setView('gems')">Hidden gems</button>
      </div>

      <div class="use-case-chips" *ngIf="!searchTerm">
        <button class="chip" [class.active]="selectedUseCase === ''" (click)="selectUseCase('')">
          <i class="pi pi-th-large"></i> All categories
        </button>
        <button *ngFor="let useCase of useCases" class="chip" [class.active]="selectedUseCase === useCase.slug" (click)="selectUseCase(useCase.slug)">
          <i class="pi {{ useCase.icon }}"></i> {{ useCase.title }}
        </button>
      </div>

      <div class="results-label" *ngIf="searchTerm && !loading && !error">
        <p-tag [value]="searchIntent ? &quot;We think you're looking for&quot; : 'Our picks'" severity="info"></p-tag>
        <span *ngIf="searchIntent">{{ visibleTools.length > 5 ? 'Top 5 of ' + visibleTools.length : visibleTools.length }} tool{{ visibleTools.length === 1 ? '' : 's' }} {{ searchIntent.label }}</span>
        <span *ngIf="!searchIntent">{{ visibleTools.length > 5 ? 'Top 5 of ' + visibleTools.length : visibleTools.length }} tool{{ visibleTools.length === 1 ? '' : 's' }} for "{{ searchTerm }}"</span>
      </div>

      <div class="rec-list" *ngIf="searchTerm && !loading && !error && visibleTools.length > 0">
        <div
          *ngFor="let tool of visibleTools.slice(0, 5); let i = index"
          class="rec-item"
          role="button"
          tabindex="0"
          (click)="openDialog(tool)"
          (keydown.enter)="openDialog(tool)"
          (keydown.space)="openDialog(tool)">
          <span class="rec-rank">#{{ i + 1 }}</span>
          <app-tool-logo [name]="tool.name" [size]="40"></app-tool-logo>
          <div class="rec-info">
            <div class="rec-name">
              <h3>{{ tool.name }}</h3>
              <p-tag [value]="tool.pricing" [severity]="pricingSeverity(tool.pricing)"></p-tag>
            </div>
            <p class="rec-best">{{ tool.best_for }}</p>
            <p class="rec-why" *ngIf="tool.review_note"><i class="pi pi-comment"></i> {{ tool.review_note }}</p>
          </div>
          <span class="rec-go"><i class="pi pi-arrow-right"></i></span>
        </div>
      </div>

      <div class="tools-grid" *ngIf="!searchTerm && !loading && !error">
        <div
          *ngFor="let tool of visibleTools"
          class="tool-card"
          role="button"
          tabindex="0"
          (click)="openDialog(tool)"
          (keydown.enter)="openDialog(tool)"
          (keydown.space)="openDialog(tool)">
          <div class="card-media">
            <div class="card-badges">
              <span class="gem-badge" *ngIf="tool.is_gem"><i class="pi pi-heart-fill"></i> Hidden gem</span>
              <span class="new-badge" *ngIf="tool.is_new && !tool.is_gem"><i class="pi pi-sparkles"></i> New</span>
            </div>
            <app-tool-logo [name]="tool.name" [size]="56"></app-tool-logo>
          </div>
          <h3>{{ tool.name }}</h3>
          <div class="review-line" *ngIf="tool.confidence">
            <span class="stars" [attr.aria-label]="'Reviewed with ' + tool.confidence + ' out of 5 stars'">
              <i *ngFor="let i of [1,2,3,4,5]" class="pi" [ngClass]="i <= tool.confidence ? 'pi-star-fill' : 'pi-star'"></i>
            </span>
            <span class="reviewed-at" *ngIf="tool.last_reviewed">Reviewed {{ reviewedDate(tool.last_reviewed) }}</span>
          </div>
          <p class="best-for">{{ tool.best_for }}</p>
          <p class="desc">{{ tool.description }}</p>
          <div class="card-tags">
            <p-tag [value]="tool.pricing" [severity]="pricingSeverity(tool.pricing)"></p-tag>
            <p-tag *ngIf="tool.beginner_friendly" value="Beginner friendly" severity="info"></p-tag>
            <p-tag *ngFor="let uc of toolUseCases(tool)" [value]="uc" severity="secondary"></p-tag>
          </div>
          <div class="card-actions">
            <button class="card-save" [class.saved]="savedIds.has(tool.id)" [attr.aria-label]="savedIds.has(tool.id) ? 'Remove ' + tool.name + ' from saved' : 'Save ' + tool.name + ' for later'" (click)="toggleSave(tool, $event)">
              <i class="pi" [ngClass]="savedIds.has(tool.id) ? 'pi-bookmark-fill' : 'pi-bookmark'"></i>
              {{ savedIds.has(tool.id) ? 'Saved' : 'Save' }}
            </button>
            <button class="card-visit" (click)="visit(tool, $event)" [attr.aria-label]="'Open ' + tool.name + ' website'">Visit <i class="pi pi-external-link"></i></button>
          </div>
        </div>
      </div>

      <div class="tools-grid" *ngIf="loading">
        <app-skeleton-card variant="tool" *ngFor="let s of [0,1,2,3,4,5]" [attr.aria-hidden]="true"></app-skeleton-card>
      </div>

      <div class="error-state" *ngIf="error">
        <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
        <h3>Couldn't load tools</h3>
        <p>Our servers are having a moment. Give it another try.</p>
        <button class="btn btn-primary" (click)="retry()"><i class="pi pi-refresh"></i> Try again</button>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && visibleTools.length === 0">
        <div class="state-icon"><i class="pi pi-search"></i></div>
        <h3>We couldn't find a direct match</h3>
        <p *ngIf="searchTerm">Try describing the task differently — e.g. "study for an exam" or "build an app without coding" — or browse a curated collection below.</p>
        <p *ngIf="!searchTerm && pricingFilter !== 'All'">No {{ pricingFilter.toLowerCase() }} tools in this view. Try a different price filter.</p>
        <p *ngIf="!searchTerm && pricingFilter === 'All'">This view is still being curated. Try another tab or browse collections.</p>
        <a routerLink="/collections" class="btn btn-primary">Browse collections <i class="pi pi-arrow-right"></i></a>
      </div>

      <p-dialog [(visible)]="dialogVisible" [modal]="true" [style]="{width: '600px', maxHeight: '85vh'}" [draggable]="false">
        <div *ngIf="selectedTool" class="dialog-content">
          <div class="dialog-title">
            <div class="dialog-title-left">
              <app-tool-logo [name]="selectedTool.name" [size]="64"></app-tool-logo>
              <div class="dialog-title-meta">
                <div class="dialog-badges">
                  <span class="gem-badge" *ngIf="selectedTool.is_gem"><i class="pi pi-heart-fill"></i> Hidden gem</span>
                  <span class="new-badge" *ngIf="selectedTool.is_new && !selectedTool.is_gem"><i class="pi pi-sparkles"></i> New</span>
                </div>
                <h2>{{ selectedTool.name }}</h2>
              </div>
            </div>
            <span class="price-pill" [ngClass]="'price-' + (selectedTool.pricing || 'paid').toLowerCase()"><i class="pi pi-circle-fill"></i> {{ selectedTool.pricing }}</span>
          </div>
          <div class="dialog-rating" *ngIf="selectedTool.confidence">
            <span class="stars big" [attr.aria-label]="'Reviewed with ' + selectedTool.confidence + ' out of 5 stars'">
              <i *ngFor="let i of [1,2,3,4,5]" class="pi" [ngClass]="i <= selectedTool.confidence ? 'pi-star-fill' : 'pi-star'"></i>
            </span>
            <span class="reviewed-at" *ngIf="selectedTool.last_reviewed">Reviewed {{ reviewedDate(selectedTool.last_reviewed) }}</span>
          </div>
          <p class="dialog-best-for">{{ selectedTool.best_for }}</p>
          <p class="dialog-desc">{{ selectedTool.description }}</p>

          <div class="dialog-section" *ngIf="selectedTool.pros && selectedTool.pros.length">
            <h4><i class="pi pi-check-circle" style="color:var(--success)"></i> Why people love it</h4>
            <ul class="pros-list">
              <li *ngFor="let p of selectedTool.pros"><i class="pi pi-check-circle"></i><span>{{ p }}</span></li>
            </ul>
          </div>
          <div class="dialog-section" *ngIf="selectedTool.cons && selectedTool.cons.length">
            <h4><i class="pi pi-times-circle" style="color:var(--danger)"></i> Watch out for</h4>
            <ul class="cons-list">
              <li *ngFor="let c of selectedTool.cons"><i class="pi pi-times-circle"></i><span>{{ c }}</span></li>
            </ul>
          </div>
          <div class="dialog-section" *ngIf="selectedTool.alternatives && selectedTool.alternatives.length">
            <h4><i class="pi pi-sitemap" style="color:var(--primary)"></i> Good alternatives</h4>
            <div class="alt-tags">
              <button class="alt-tag" *ngFor="let a of selectedTool.alternatives" (click)="openAlt(a)" [attr.aria-label]="'Open ' + a">
                {{ a }} <i class="pi pi-arrow-right"></i>
              </button>
            </div>
          </div>
          <div class="dialog-tags">
            <p-tag *ngIf="selectedTool.beginner_friendly" value="Beginner friendly" severity="info"></p-tag>
            <p-tag *ngFor="let uc of toolUseCases(selectedTool)" [value]="uc" severity="secondary"></p-tag>
          </div>

          <div class="dialog-section review-block" *ngIf="selectedTool?.review_note">
            <div class="review-head">
              <h4><i class="pi pi-pen-to-square" style="color:var(--primary)"></i> Our verdict</h4>
              <span class="stars big" [attr.aria-label]="'Reviewed with ' + selectedTool.confidence + ' out of 5 stars'">
                <i *ngFor="let i of [1,2,3,4,5]" class="pi" [ngClass]="i <= selectedTool.confidence ? 'pi-star-fill' : 'pi-star'"></i>
              </span>
            </div>
            <p class="review-note">{{ selectedTool.review_note }}</p>
            <span class="reviewer-line" *ngIf="selectedTool.last_reviewed">
              <i class="pi pi-shield"></i> Reviewed {{ reviewedDate(selectedTool.last_reviewed) }} by {{ selectedTool.reviewer }}
            </span>
          </div>
        </div>
        <ng-template #footer>
          <div class="dialog-footer">
            <p-button class="footer-save" *ngIf="selectedTool" [label]="savedIds.has(selectedTool.id) ? 'Saved' : 'Save'" [icon]="savedIds.has(selectedTool.id) ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'" styleClass="p-button-secondary p-button-text" (onClick)="toggleSave(selectedTool)"></p-button>
            <a *ngIf="selectedTool?.tutorial_url" [href]="selectedTool?.tutorial_url" target="_blank" rel="noopener" class="footer-tutorial" pButton label="Tutorial" icon="pi pi-play" styleClass="p-button-text"></a>
            <a [href]="selectedTool?.url" target="_blank" rel="noopener" class="footer-visit" pButton label="Visit site" icon="pi pi-external-link"></a>
          </div>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { color: var(--text-1); font-size: clamp(1.7rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .page-header p { color: var(--text-2); font-size: 0.95rem; }
    .search-wrap { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .pricing-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .search-field {
      position: relative;
      flex: 1;
      max-width: 640px;
    }
    .search-field > .pi-search {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-3);
      font-size: 0.95rem;
      pointer-events: none;
    }
    .search-input {
      background: var(--surface-1);
      border: 1px solid var(--border);
      color: var(--text-1);
      padding: 0.9rem 1rem 0.9rem 2.75rem;
      border-radius: 14px;
      font-size: 0.95rem;
      width: 100%;
      transition: border-color 0.18s var(--ease), box-shadow 0.18s var(--ease);
    }
    .search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); outline: none; }
    .search-compass { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); }
    .clear-search {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-2);
      border-radius: 8px;
      padding: 0.6rem 0.9rem;
      cursor: pointer;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      transition: all 0.2s var(--ease);
      white-space: nowrap;
    }
    .clear-search:hover { color: var(--text-1); border-color: var(--border-strong); background: var(--surface-2); }
    .tabs { display: flex; gap: 0.25rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); overflow-x: auto; }
    .tab {
      position: relative;
      background: transparent;
      border: none;
      color: var(--text-2);
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.65rem 0.875rem;
      cursor: pointer;
      white-space: nowrap;
      transition: color 0.18s var(--ease);
    }
    .tab:hover { color: var(--text-1); }
    .tab.active { color: var(--text-1); font-weight: 600; }
    .tab.active::after {
      content: '';
      position: absolute;
      left: 0.875rem; right: 0.875rem; bottom: -1px;
      height: 2px;
      border-radius: 2px 2px 0 0;
      background: var(--primary);
    }
    .use-case-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .results-label { display: flex; align-items: center; gap: 0.75rem; color: var(--text-2); font-size: 0.9rem; margin-bottom: 1.5rem; animation: fadeInUp 0.3s var(--ease) both; }

    .rec-list { display: flex; flex-direction: column; gap: 0.85rem; animation: fadeInUp 0.3s var(--ease) both; }
    .rec-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.1rem 1.3rem;
      cursor: pointer;
      transition: transform 0.2s var(--ease), border-color 0.2s var(--ease), box-shadow 0.25s var(--ease);
    }
    .rec-item:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow-md); }
    .rec-item:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    .rec-rank {
      width: 34px; height: 34px;
      flex-shrink: 0;
      border-radius: 999px;
      background: var(--primary-soft);
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .rec-info { flex: 1; min-width: 0; }
    .rec-name { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem; }
    .rec-name h3 { color: var(--text-1); font-size: 1rem; font-weight: 600; }
    .rec-best { color: var(--text-2); font-size: 0.82rem; margin-bottom: 0.2rem; }
    .rec-why { color: var(--text-2); font-size: 0.8rem; font-style: italic; opacity: 0.85; display: flex; gap: 0.4rem; align-items: flex-start; }
    .rec-why i { margin-top: 0.15rem; }
    .rec-go { color: var(--primary); flex-shrink: 0; transition: transform 0.2s var(--ease); }
    .rec-item:hover .rec-go { transform: translateX(3px); }

    .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    .tool-card {
      background: var(--surface-1);
      border-radius: 14px;
      padding: 1.25rem;
      border: 1px solid var(--border);
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }
    .tool-card:hover { background: var(--surface-2); }
    .card-media {
      position: relative;
      height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 1.1rem;
      overflow: hidden;
    }
    .card-badges { position: absolute; top: 0.75rem; left: 0.75rem; display: flex; gap: 0.375rem; }
    .new-badge, .gem-badge {
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 999px;
      padding: 0.25rem 0.6rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      white-space: nowrap;
    }
    .new-badge { color: var(--text-2); background: var(--surface-1); border: 1px solid var(--border); }
    .gem-badge { color: var(--primary); background: var(--primary-soft); }
    .tool-card h3 { color: var(--text-1); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.375rem; }
    .review-line { display: flex; align-items: center; gap: 0.5rem; margin: 0 0 0.5rem; }
    .stars { display: inline-flex; gap: 2px; color: var(--warning); font-size: 0.72rem; }
    .stars i { font-size: 0.72rem; }
    .stars.big i { font-size: 0.85rem; }
    .reviewed-at { color: var(--text-3); font-size: 0.72rem; white-space: nowrap; }
    .best-for { color: var(--text-2); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
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
    .card-tags { display: flex; gap: 0.375rem; flex-wrap: wrap; margin-top: auto; }
    .card-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 0.9rem;
      border-top: 1px solid var(--border);
    }
    .card-save {
      background: transparent;
      border: none;
      color: var(--text-2);
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.5rem;
      border-radius: 8px;
      transition: color 0.18s var(--ease), background 0.18s var(--ease);
    }
    .card-save:hover { color: var(--text-1); background: var(--surface-2); }
    .card-save.saved { color: var(--primary); }
    .card-visit {
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--text-1);
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      transition: border-color 0.18s var(--ease), color 0.18s var(--ease), background 0.18s var(--ease);
    }
    .card-visit:hover { border-color: var(--border-strong); background: var(--surface-1); }
    .dialog-title { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1.25rem; }
    .dialog-title-left { display: flex; align-items: flex-start; gap: 1.25rem; }
    .dialog-title-meta { min-width: 0; }
    .dialog-title h2 { color: var(--text-1); margin: 0.55rem 0 0; font-size: 1.5rem; letter-spacing: -0.025em; line-height: 1.2; }
    .dialog-badges { display: flex; gap: 0.375rem; }
    .price-pill { display: inline-flex; align-items: center; gap: 0.45rem; font-size: 0.76rem; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; padding: 0.34rem 0.85rem; border-radius: var(--radius-full); white-space: nowrap; }
    .price-pill i { font-size: 0.5rem; }
    .price-free { color: var(--success); background: rgba(52, 211, 153, 0.12); }
    .price-freemium { color: var(--warning); background: rgba(251, 191, 36, 0.12); }
    .price-paid { color: var(--text-2); background: var(--surface-2); border: 1px solid var(--border); }
    .dialog-rating { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.05rem; }
    .dialog-best-for { color: var(--text-1); font-weight: 600; font-size: 1.02rem; line-height: 1.5; margin-bottom: 0.45rem; }
    .dialog-desc { color: var(--text-2); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.35rem; }
    .dialog-section { margin-bottom: 1.3rem; }
    .dialog-section h4 { color: var(--text-1); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; }
    .dialog-section ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
    .dialog-section li { display: flex; gap: 0.4rem; align-items: flex-start; color: var(--text-2); font-size: 0.875rem; line-height: 1.55; }
    .dialog-section li i { margin-top: 0.18rem; font-size: 0.85rem; flex-shrink: 0; }
    .pros-list li i { color: var(--success); }
    .cons-list li i { color: var(--danger); }
    .alt-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
    .alt-tag {
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--text-2);
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
    .alt-tag:hover { border-color: var(--border-strong); color: var(--text-1); }
    .alt-tag i { font-size: 0.7rem; color: var(--primary); }
    .dialog-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.3rem; }
    .review-block { background: var(--surface-2); border: 1px solid var(--border); border-left: 3px solid var(--primary); border-radius: var(--radius); padding: 1.15rem 1.25rem; }
    .review-block h4 { margin-bottom: 0; }
    .review-head { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.55rem; flex-wrap: wrap; }
    .review-note { color: var(--text-2); font-size: 0.95rem; font-style: italic; line-height: 1.65; margin: 0 0 0.6rem; }
    .reviewer-line { color: var(--text-3); font-size: 0.78rem; display: inline-flex; align-items: center; gap: 0.4rem; }
    .reviewer-line i { color: var(--primary); font-size: 0.8rem; }
    .dialog-footer { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 2rem; padding-top: 0.5rem; width: 100%; }
    .dialog-footer .footer-save { justify-self: start; }
    .dialog-footer .footer-tutorial { justify-self: center; }
    .dialog-footer .footer-tutorial, .dialog-footer .footer-tutorial i { color: var(--text-3); }
    .dialog-footer .footer-tutorial:hover, .dialog-footer .footer-tutorial:hover i { color: var(--text-2); }
    .dialog-footer .footer-visit { justify-self: end; padding: 0.7rem 1.5rem; font-weight: 600; box-shadow: 0 4px 16px var(--primary-glow); }
    @media (max-width: 640px) {
      .tools-grid { grid-template-columns: 1fr; }
      .search-wrap { align-items: stretch; flex-direction: column; }
    }
  `]
})
export class ToolsComponent implements OnInit, OnDestroy {
  tools: Tool[] = [];
  useCases: UseCase[] = [];
  searchTerm = '';
  selectedUseCase = '';
  pricingFilter: 'All' | 'Free' | 'Freemium' | 'Paid' = 'All';
  viewMode: 'all' | 'trending' | 'new' | 'gems' = 'all';
  dialogVisible = false;
  selectedTool: Tool | null = null;
  savedIds = new Set<number>();
  searchIntent: { key: string; label: string } | null = null;
  loading = true;
  searching = false;
  error = false;
  private allTools: Tool[] = [];
  private term$ = new Subject<string>();

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.term$.pipe(debounceTime(280), distinctUntilChanged()).subscribe(q => {
      this.performSearch(q);
    });
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      const id = params['id'];
      const useCase = params['useCase'];
      const view = params['view'];
      if (q) {
        this.searchTerm = q;
        this.performSearch(q, () => this.maybeOpenTool(id));
        return;
      }
      if (view === 'gems' || view === 'new') {
        this.viewMode = view;
      }
      if (useCase) {
        this.selectedUseCase = useCase;
      }
      this.loadBase(id);
    });
    if (this.auth.isLoggedIn) {
      this.loadSaved();
    }
  }

  ngOnDestroy(): void {
    this.term$.complete();
  }

  onTermChange(term: string): void {
    this.term$.next(term);
  }

  loadBase(openId?: string): void {
    this.loading = true;
    this.error = false;
    this.api.getUseCases().subscribe({
      next: res => {
        this.useCases = res.data;
        this.api.getTools(1, 50, '', '', this.selectedUseCase).subscribe({
          next: list => {
            this.allTools = list.data;
            this.loading = false;
            this.applyView(openId);
          },
          error: () => { this.loading = false; this.error = true; }
        });
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }

  applyView(openId?: string): void {
    if (this.viewMode === 'new') {
      this.tools = this.allTools.filter(t => t.is_new);
    } else if (this.viewMode === 'gems') {
      this.tools = this.allTools.filter(t => t.is_gem);
    } else {
      this.tools = this.allTools;
    }
    this.maybeOpenTool(openId);
  }

  maybeOpenTool(id?: string): void {
    if (!id) return;
    const tool = this.tools.find(t => t.id === Number(id));
    if (tool) {
      this.openDialog(tool);
    } else {
      this.api.getToolById(Number(id)).subscribe(t => this.openDialog(t));
    }
    this.router.navigate(['/tools'], { queryParams: { useCase: this.selectedUseCase || undefined }, queryParamsHandling: 'merge' });
  }

  setView(mode: 'all' | 'trending' | 'new' | 'gems'): void {
    this.viewMode = mode;
    if (mode === 'trending') {
      this.loading = true;
      this.error = false;
      this.api.getTrendingTools().subscribe({
        next: res => { this.tools = res.data; this.loading = false; },
        error: () => { this.loading = false; this.error = true; }
      });
    } else {
      this.applyView();
    }
  }

  get visibleTools(): Tool[] {
    if (this.pricingFilter === 'All') return this.tools;
    return this.tools.filter(t => t.pricing === this.pricingFilter);
  }

  setPricing(filter: 'All' | 'Free' | 'Freemium' | 'Paid'): void {
    this.pricingFilter = filter;
  }

  performSearch(q: string, done?: () => void): void {
    const trimmed = q.trim();
    if (!trimmed) return;
    this.loading = true;
    this.searching = true;
    this.error = false;
    this.api.searchTools(trimmed).subscribe({
      next: res => {
        this.tools = res.data;
        this.searchIntent = res.intent || null;
        this.searching = false;
        this.loading = false;
        done?.();
      },
      error: () => {
        this.searching = false;
        this.loading = false;
        this.error = true;
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchIntent = null;
    this.searching = false;
    this.router.navigate(['/tools'], { queryParams: this.selectedUseCase ? { useCase: this.selectedUseCase } : {} });
    this.applyView();
  }

  selectUseCase(slug: string): void {
    this.selectedUseCase = slug;
    this.router.navigate(['/tools'], { queryParams: slug ? { useCase: slug } : {} });
    this.loading = true;
    this.error = false;
    this.api.getTools(1, 50, '', '', slug).subscribe({
      next: list => {
        this.allTools = list.data;
        this.loading = false;
        this.applyView();
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }

  retry(): void {
    if (this.searchTerm) {
      this.performSearch(this.searchTerm);
    } else {
      this.loadBase();
    }
  }

  loadSaved(): void {
    this.api.getSavedTools().subscribe(res => {
      this.savedIds = new Set(res.data.map(s => s.id));
    });
  }

  toggleSave(tool: Tool, event?: MouseEvent): void {
    event?.stopPropagation();
    if (!this.auth.isLoggedIn) {
      this.message.add({ severity: 'info', summary: 'Sign in to save', detail: 'Create a free account to keep a bookmark brain.' });
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

  toolUseCases(tool: Tool): string[] {
    const map: Record<string, string> = {};
    this.useCases.forEach(u => map[u.slug] = u.title);
    return (tool.use_cases || []).map(slug => map[slug]).filter(Boolean);
  }

  visit(tool: Tool, event?: MouseEvent): void {
    event?.stopPropagation();
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener');
    }
  }

  pricingSeverity(p: string): 'success' | 'warn' | 'danger' | 'info' {
    return p === 'Free' ? 'success' : p === 'Freemium' ? 'warn' : p === 'Paid' ? 'info' : 'info';
  }

  reviewedDate(date: string): string {
    const iso = (date || '').split('T')[0];
    const parts = iso.split('-');
    if (parts.length < 2) return date;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    return `${month} ${parts[0]}`;
  }

  openDialog(tool: Tool): void {
    this.selectedTool = tool;
    this.dialogVisible = true;
  }

  openAlt(name: string): void {
    const found = this.allTools.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (found) {
      this.openDialog(found);
      return;
    }
    this.api.getToolByName(name).subscribe({
      next: tool => this.openDialog(tool),
      error: () => this.message.add({
        severity: 'info',
        summary: 'Not in the catalog yet',
        detail: `${name} isn't in our catalog yet — we'll add it soon.`
      })
    });
  }
}
