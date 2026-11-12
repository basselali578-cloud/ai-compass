import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Tool, UseCase, Collection, Workflow } from '../../core/models/api.models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { ToolLogoComponent } from '../../shared/components/tool-logo/tool-logo.component';
import { CompassMarkComponent } from '../../shared/components/compass-mark/compass-mark.component';
import { CollectionArtComponent } from '../../shared/components/collection-art/collection-art.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    TagModule,
    SkeletonCardComponent,
    ToolLogoComponent,
    CompassMarkComponent,
    CollectionArtComponent
  ],
  template: `
    <section class="launchpad">
      <div class="launchpad-inner">
        <div class="launchpad-copy">
          <div class="badge"><i class="pi pi-compass"></i> Curated, not scraped</div>
          <h1>What do you want to build <span class="grad">today?</span></h1>
          <p class="subtitle">Find the right AI tool in under a minute. Describe the job — we'll point you in the right direction.</p>

          <form class="search-box" (ngSubmit)="onSearch()">
            <i class="pi pi-search search-icon"></i>
            <input
              [(ngModel)]="query"
              (ngModelChange)="onQueryChange($event)"
              name="query"
              placeholder='e.g. "I need an AI to remove backgrounds"'
              class="search-input"
              autocomplete="off"
              aria-label="Describe the job you want done">
            <button type="submit" class="search-btn">Find tools <i class="pi pi-arrow-right"></i></button>
          </form>

          <div class="trust-note">
            <i class="pi pi-check-circle"></i> Hand-tested every week
            <span class="dot"></span>
            <i class="pi pi-ban"></i> No sponsored listings
            <span class="dot"></span>
            <i class="pi pi-users"></i> Built for builders
          </div>

          <div class="quick-prompts">
            <button *ngFor="let prompt of quickPrompts" class="prompt-chip" (click)="runPrompt(prompt)">
              <i class="pi {{ prompt.icon }}"></i> {{ prompt.label }}
            </button>
          </div>
        </div>

        <div class="launchpad-visual" aria-hidden="true">
          <div class="compass-stage">
            <app-compass-mark [size]="200" [angle]="compassAngle"></app-compass-mark>
            <span class="compass-label label-coding" [class.active]="activeLabel === 'Coding'">Coding</span>
            <span class="compass-label label-design" [class.active]="activeLabel === 'Design'">Design</span>
            <span class="compass-label label-marketing" [class.active]="activeLabel === 'Marketing'">Marketing</span>
            <span class="compass-label label-research" [class.active]="activeLabel === 'Research'">Research</span>
            <span class="compass-label label-video" [class.active]="activeLabel === 'Video'">Video</span>
            <span class="compass-label label-automation" [class.active]="activeLabel === 'Automation'">Automation</span>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="section trust-strip" aria-label="Why you can trust our recommendations">
        <div class="trust-card">
          <div class="trust-icon"><i class="pi pi-user-check"></i></div>
          <h3>Tested by humans</h3>
          <p>Every tool is used by an editor before it earns a spot. If it's clunky, it's gone.</p>
        </div>
        <div class="trust-card">
          <div class="trust-icon"><i class="pi pi-sync"></i></div>
          <h3>Refreshed weekly</h3>
          <p>The AI landscape moves fast. We re-check our picks and drop anything stale.</p>
        </div>
        <div class="trust-card">
          <div class="trust-icon"><i class="pi pi-filter"></i></div>
          <h3>Quality over volume</h3>
          <p>33 tools, hand-picked. Not 5,000 scraped listings you'll never scroll through.</p>
        </div>
        <div class="trust-card">
          <div class="trust-icon"><i class="pi pi-shield"></i></div>
          <h3>No sponsored picks</h3>
          <p>Tools can't pay to rank. The only thing that matters is whether they work.</p>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Start with what you want to do</h2>
            <p class="subtitle">Pick a goal. Get a curated shortlist, not a wall of results.</p>
          </div>
        </div>
        <div class="launch-grid">
          <button *ngFor="let goal of goals" class="launch-card" (click)="runPrompt(goal)">
            <div class="launch-icon"><i class="pi {{ goal.icon }}"></i></div>
            <h3>{{ goal.label }}</h3>
            <p>{{ goal.hint }}</p>
            <span class="launch-go">Go <i class="pi pi-arrow-right"></i></span>
          </button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Trending this week</h2>
            <p class="subtitle">What builders are reaching for this week.</p>
          </div>
          <a routerLink="/tools" class="view-all">All tools <i class="pi pi-arrow-right"></i></a>
        </div>

        <div class="tool-row" *ngIf="!trendingLoading && !trendingError && trending.length > 0">
          <div
            *ngFor="let tool of trending"
            class="tool-pill"
            role="button"
            tabindex="0"
            (click)="openTool(tool)"
            (keydown.enter)="openTool(tool)"
            (keydown.space)="openTool(tool)">
            <app-tool-logo [name]="tool.name" [size]="44"></app-tool-logo>
            <div class="pill-info">
              <h3>{{ tool.name }}</h3>
              <span class="pill-stars" *ngIf="tool.confidence" [attr.aria-label]="'Reviewed with ' + tool.confidence + ' out of 5 stars'">
                <i *ngFor="let i of [1,2,3,4,5]" class="pi" [ngClass]="i <= tool.confidence ? 'pi-star-fill' : 'pi-star'"></i>
                <span class="pill-reviewed" *ngIf="tool.last_reviewed">Reviewed {{ reviewedDate(tool.last_reviewed) }}</span>
              </span>
              <p>{{ tool.best_for }}</p>
            </div>
            <div class="pill-badges">
              <p-tag [value]="tool.pricing" [severity]="pricingSeverity(tool.pricing)" styleClass="p-tag-sm"></p-tag>
              <span class="pill-new" *ngIf="tool.is_new"><i class="pi pi-sparkles"></i> New</span>
            </div>
          </div>
        </div>
        <div class="tool-row" *ngIf="trendingLoading">
          <app-skeleton-card variant="tool-pill" *ngFor="let s of [0,1,2,3]" [attr.aria-hidden]="true"></app-skeleton-card>
        </div>
        <div class="error-state" *ngIf="trendingError">
          <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <h3>Couldn't load trending tools</h3>
          <p>Our servers are having a moment. Give it another try.</p>
          <button class="btn btn-primary" (click)="loadTrending()"><i class="pi pi-refresh"></i> Try again</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Open source &amp; self-hosted</h2>
            <p class="subtitle">Run it yourself. No subscriptions, no data leaving your machine.</p>
          </div>
          <a routerLink="/collections/open-source-self-hosted" class="view-all">Open the collection <i class="pi pi-arrow-right"></i></a>
        </div>

        <div class="oss-list" *ngIf="!ossLoading && !ossError && oss.length > 0">
          <div
            *ngFor="let tool of oss"
            class="oss-row"
            role="button"
            tabindex="0"
            (click)="openTool(tool)"
            (keydown.enter)="openTool(tool)"
            (keydown.space)="openTool(tool)">
            <app-tool-logo [name]="tool.name" [size]="26"></app-tool-logo>
            <div class="oss-info">
              <h3>{{ tool.name }}</h3>
              <p>{{ tool.best_for }}</p>
            </div>
            <span class="oss-tag"><i class="pi pi-github"></i> Open source</span>
            <p-tag [value]="tool.pricing" [severity]="pricingSeverity(tool.pricing)" styleClass="p-tag-sm"></p-tag>
          </div>
        </div>
        <div class="tool-row" *ngIf="ossLoading">
          <app-skeleton-card variant="tool-pill" *ngFor="let s of [0,1,2,3]" [attr.aria-hidden]="true"></app-skeleton-card>
        </div>
        <div class="error-state" *ngIf="ossError">
          <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <h3>Couldn't load the open source collection</h3>
          <button class="btn btn-primary" (click)="loadOss()"><i class="pi pi-refresh"></i> Try again</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Starter stacks</h2>
            <p class="subtitle">Not just the tool — the order to use them. Tested end-to-end.</p>
          </div>
          <a routerLink="/workflows" class="view-all">All workflows <i class="pi pi-arrow-right"></i></a>
        </div>

        <div class="wf-strip" *ngIf="!wfLoading && !wfError && workflows.length > 0">
          <a
            *ngFor="let w of workflows"
            [routerLink]="['/workflows', w.slug]"
            class="wf-card">
            <div class="wf-head">
              <div class="wf-icon" [style.background]="w.color + '1a'" [style.color]="w.color">
                <i class="pi {{ w.icon }}"></i>
              </div>
              <div class="wf-head-text">
                <h3>{{ w.title }}</h3>
                <span>{{ w.goal }}</span>
              </div>
            </div>
            <div class="wf-timeline">
              <div class="wf-step" *ngFor="let step of w.preview; let i = index">
                <span class="wf-node" [style.background]="w.color">{{ i + 1 }}</span>
                <span class="wf-step-name">{{ step.name }}</span>
              </div>
              <div class="wf-step" *ngIf="w.step_count > (w.preview?.length || 0)">
                <span class="wf-node wf-node-more">+{{ w.step_count - (w.preview?.length || 0) }}</span>
                <span class="wf-step-name">more steps</span>
              </div>
            </div>
            <div class="wf-foot">
              <span class="wf-meta"><i class="pi pi-clock"></i> ~{{ w.estimated_minutes }} min</span>
              <span class="wf-arrow">View stack <i class="pi pi-arrow-right"></i></span>
            </div>
          </a>
        </div>
        <div class="wf-strip" *ngIf="wfLoading">
          <app-skeleton-card variant="workflow" *ngFor="let s of [0,1,2]" [attr.aria-hidden]="true"></app-skeleton-card>
        </div>
        <div class="error-state" *ngIf="wfError">
          <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <h3>Couldn't load workflows</h3>
          <button class="btn btn-primary" (click)="loadWorkflows()"><i class="pi pi-refresh"></i> Try again</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Curated collections</h2>
            <p class="subtitle">Done-for-you shortlists for specific people.</p>
          </div>
          <a routerLink="/collections" class="view-all">All collections <i class="pi pi-arrow-right"></i></a>
        </div>

        <div class="collection-grid" *ngIf="!collectionsLoading && !collectionsError && collections.length > 0">
          <a
            *ngFor="let collection of collections"
            [routerLink]="['/collections', collection.slug]"
            class="collection-card">
            <div class="collection-cover" [style.background]="collection.color + '12'">
              <app-collection-art [slug]="collection.slug" [color]="collection.color"></app-collection-art>
            </div>
            <div class="collection-body">
              <h3>{{ collection.title }}</h3>
              <p>{{ collection.description }}</p>
              <span class="collection-count">{{ collection.tool_count }} tools</span>
            </div>
          </a>
        </div>
        <div class="collection-grid" *ngIf="collectionsLoading">
          <app-skeleton-card variant="collection" *ngFor="let s of [0,1,2,3]" [attr.aria-hidden]="true"></app-skeleton-card>
        </div>
        <div class="error-state" *ngIf="collectionsError">
          <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <h3>Couldn't load collections</h3>
          <button class="btn btn-primary" (click)="loadCollections()"><i class="pi pi-refresh"></i> Try again</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Hidden gems we love</h2>
            <p class="subtitle">Under-the-radar tools our editors actually reach for.</p>
          </div>
          <a routerLink="/tools" [queryParams]="{ view: 'gems' }" class="view-all">All hidden gems <i class="pi pi-arrow-right"></i></a>
        </div>

        <div class="gem-grid" *ngIf="!gemsLoading && !gemsError && gems.length > 0">
          <div
            *ngFor="let tool of gems"
            class="gem-card"
            role="button"
            tabindex="0"
            (click)="openTool(tool)"
            (keydown.enter)="openTool(tool)"
            (keydown.space)="openTool(tool)">
            <app-tool-logo [name]="tool.name" [size]="34"></app-tool-logo>
            <div class="gem-info">
              <h3>{{ tool.name }}</h3>
              <p>{{ tool.best_for }}</p>
              <span class="gem-meta"><i class="pi pi-heart-fill"></i> Editor's pick<span *ngIf="tool.last_reviewed"> · Reviewed {{ reviewedDate(tool.last_reviewed) }}</span></span>
            </div>
          </div>
        </div>
        <div class="tool-row" *ngIf="gemsLoading">
          <app-skeleton-card variant="tool-pill" *ngFor="let s of [0,1,2,3]" [attr.aria-hidden]="true"></app-skeleton-card>
        </div>
        <div class="error-state" *ngIf="gemsError">
          <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <h3>Couldn't load hidden gems</h3>
          <p>Our servers are having a moment. Give it another try.</p>
          <button class="btn btn-primary" (click)="loadGems()"><i class="pi pi-refresh"></i> Try again</button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .launchpad {
      padding: 5.5rem 1.5rem 5rem;
      border-bottom: 1px solid var(--border);
      background:
        radial-gradient(900px 420px at 50% -8%, rgba(99, 102, 241, 0.05), transparent 65%),
        var(--bg);
    }
    .launchpad-inner { display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: center; gap: 3rem; max-width: 1120px; margin: 0 auto; }
    .launchpad-copy { text-align: left; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: var(--primary-soft);
      color: var(--primary);
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      margin-bottom: 1.4rem;
      border: 1px solid rgba(99, 102, 241, 0.28);
    }
    h1 {
      color: var(--text-1);
      font-size: clamp(2.1rem, 4.4vw, 3rem);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      margin-bottom: 1.1rem;
      text-wrap: balance;
    }
    .grad { color: var(--primary); }
    .subtitle { color: var(--text-2); font-size: 1.05rem; line-height: 1.7; max-width: 520px; margin-bottom: 2.25rem; text-wrap: pretty; }
    .search-box {
      display: flex;
      align-items: center;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: var(--space-2) var(--space-2) var(--space-2) 1.25rem;
      gap: 0.75rem;
      box-shadow: var(--shadow-sm);
      transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
      max-width: 560px;
    }
    .search-box:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }
    .search-icon { color: var(--primary); font-size: 1.1rem; }
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-1);
      font-size: 1rem;
      min-height: 48px;
      padding: 0 0.25rem;
      min-width: 0;
    }
    .search-input:focus { outline: none; }
    .search-input::placeholder { color: var(--text-3); }
    .search-btn {
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      padding: 0 1.5rem;
      min-height: 48px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      transition: transform 0.18s var(--ease), box-shadow 0.18s var(--ease), background 0.18s var(--ease);
    }
    .search-btn:hover { transform: translateY(-1px); background: var(--primary-strong); box-shadow: 0 6px 16px -8px rgba(2, 6, 23, 0.35); }
    .search-btn:active { transform: translateY(0) scale(0.98); }
    .trust-note {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
      color: var(--text-3);
      font-size: 0.78rem;
    }
    .trust-note i { color: var(--success); font-size: 0.85rem; }
    .trust-note .dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); margin: 0 0.25rem; }
    .quick-prompts { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1.75rem; }
    .prompt-chip {
      background: var(--surface-1);
      color: var(--text-2);
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      box-shadow: var(--shadow-sm);
      transition: border-color 0.2s var(--ease), color 0.2s var(--ease), box-shadow 0.2s var(--ease), transform 0.2s var(--ease);
    }
    .prompt-chip:hover { border-color: var(--border-strong); color: var(--text-1); background: var(--surface-2); }
    .prompt-chip i { color: var(--primary); }

    .launchpad-visual { display: flex; justify-content: center; align-items: center; }
    .compass-stage { position: relative; width: 200px; height: 200px; }
    .compass-label {
      position: absolute;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--text-3);
      white-space: nowrap;
      transition: color 0.3s var(--ease);
    }
    .compass-label.active { color: var(--primary); }
    .label-coding { top: -2.6rem; left: 50%; transform: translateX(-50%); }
    .label-design { top: 26%; left: -4.2rem; }
    .label-marketing { top: 26%; right: -4.2rem; }
    .label-research { bottom: 26%; left: -4.2rem; }
    .label-video { bottom: 26%; right: -4.2rem; }
    .label-automation { bottom: -2.6rem; left: 50%; transform: translateX(-50%); }

    .trust-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); margin-top: -2.2rem; position: relative; z-index: 2; }
    .trust-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.15rem 1.25rem;
      box-shadow: var(--shadow-sm);
      transition: transform 0.22s var(--ease), border-color 0.22s var(--ease), box-shadow 0.22s var(--ease);
    }
    .trust-card:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow-md); }
    .trust-icon {
      width: 40px; height: 40px;
      background: var(--surface-2);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-2); font-size: 1.05rem;
      margin-bottom: 0.75rem;
    }
    .trust-card h3 { color: var(--text-1); font-size: 0.95rem; font-weight: 600; margin-bottom: 0.4rem; }
    .trust-card p { color: var(--text-2); font-size: 0.8rem; line-height: 1.55; }

    .container { max-width: 1280px; margin: 0 auto; padding: 0 var(--space-5); }
    .section { margin: 6.5rem 0; }
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; gap: 1rem; }
    .section-header h2 { color: var(--text-1); font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
    .section-header .subtitle { color: var(--text-2); font-size: 0.95rem; margin: 0.5rem 0 0; }
    .view-all { color: var(--primary); text-decoration: none; font-weight: 500; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; white-space: nowrap; transition: gap 0.2s var(--ease); }
    .view-all:hover { gap: 0.75rem; }

    .launch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(235px, 1fr)); gap: var(--space-4); }
    .launch-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.35rem;
      text-align: left;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
    }
    .launch-icon {
      width: 52px; height: 52px;
      background: var(--primary-soft);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); font-size: 1.3rem;
      margin-bottom: 1rem;
      transition: transform 0.25s var(--ease);
    }
    .launch-card:hover .launch-icon { transform: scale(1.06); }
    .launch-card h3 { color: var(--text-1); font-size: 1.05rem; font-weight: 600; margin-bottom: 0.375rem; }
    .launch-card p { color: var(--text-2); font-size: 0.8rem; line-height: 1.5; margin-bottom: 0.75rem; }
    .launch-go { color: var(--primary); font-size: 0.8rem; font-weight: 500; display: inline-flex; align-items: center; gap: 0.375rem; transition: gap 0.2s var(--ease); }
    .launch-card:hover .launch-go { gap: 0.6rem; }

    .tool-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-4); }
    .tool-pill {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 0.95rem 1.15rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
    }
    .pill-info { flex: 1; min-width: 0; }
    .pill-info h3 { color: var(--text-1); font-size: 0.95rem; font-weight: 600; margin-bottom: 0.3rem; }
    .pill-stars { display: inline-flex; align-items: center; gap: 2px; color: var(--warning); font-size: 0.7rem; margin-bottom: 0.3rem; }
    .pill-reviewed { color: var(--text-3); font-weight: 500; font-size: 0.72rem; margin-left: 0.4rem; }
    .pill-info p { color: var(--text-2); font-size: 0.8rem; line-height: 1.4; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pill-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 0.375rem; }
    .pill-new { color: var(--text-2); font-size: 0.72rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; }

    .oss-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .oss-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.8rem 1rem;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s var(--ease), border-color 0.2s var(--ease), box-shadow 0.22s var(--ease);
    }
    .oss-row:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow-md); }
    .oss-info { flex: 1; min-width: 0; }
    .oss-info h3 { color: var(--text-1); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.15rem; }
    .oss-info p { color: var(--text-2); font-size: 0.75rem; line-height: 1.35; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .oss-tag {
      color: var(--text-2);
      background: var(--surface-2);
      border: 1px solid var(--border);
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 999px;
      padding: 0.3rem 0.65rem;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      white-space: nowrap;
    }
    .oss-tag i { color: var(--text-3); font-size: 0.75rem; }

    .collection-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: var(--space-4); }
    .collection-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 14px;
      text-decoration: none;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s var(--ease), border-color 0.2s var(--ease), box-shadow 0.22s var(--ease);
    }
    .collection-card:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow-md); }
    .collection-cover {
      height: 92px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--border);
    }
    .collection-body { padding: 1.1rem 1.25rem 1.25rem; }
    .collection-card h3 { color: var(--text-1); font-size: 1rem; font-weight: 600; margin-bottom: 0.375rem; }
    .collection-card p { color: var(--text-2); font-size: 0.8rem; line-height: 1.5; margin-bottom: 0.75rem; }
    .collection-count { color: var(--text-3); font-size: 0.78rem; font-weight: 600; }

    .gem-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 0.85rem; }
    .gem-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.8rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.9rem;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s var(--ease), border-color 0.2s var(--ease), box-shadow 0.22s var(--ease);
    }
    .gem-card:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow-md); }
    .gem-info { flex: 1; min-width: 0; }
    .gem-info h3 { color: var(--text-1); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.15rem; }
    .gem-info p { color: var(--text-2); font-size: 0.75rem; line-height: 1.35; margin: 0 0 0.3rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .gem-meta { color: var(--text-3); font-size: 0.72rem; display: inline-flex; align-items: center; gap: 0.3rem; }
    .gem-meta i { color: var(--warning); font-size: 0.7rem; }

    .wf-strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: var(--space-4); }
    .wf-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.15rem 1.25rem 1rem;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s var(--ease), box-shadow 0.25s var(--ease), border-color 0.2s var(--ease);
    }
    .wf-card:hover { transform: translateY(-2px); border-color: var(--border-strong); box-shadow: var(--shadow-md); }
    .wf-head { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1rem; }
    .wf-icon {
      width: 44px; height: 44px;
      border-radius: 11px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.15rem;
      flex-shrink: 0;
    }
    .wf-head-text { min-width: 0; }
    .wf-head-text h3 { color: var(--text-1); font-size: 1rem; font-weight: 600; margin-bottom: 0.2rem; }
    .wf-head-text span { color: var(--text-2); font-size: 0.78rem; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .wf-timeline { position: relative; margin: 0 0 0.25rem 0.4rem; padding-left: 1.35rem; flex: 1; }
    .wf-timeline::before {
      content: '';
      position: absolute;
      left: 9px; top: 6px; bottom: 6px;
      width: 1px;
      background: var(--border);
    }
    .wf-step { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.45rem; }
    .wf-node {
      position: relative;
      width: 19px; height: 19px;
      border-radius: 50%;
      color: #fff;
      font-size: 0.62rem;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 0 0 3px var(--surface-1);
    }
    .wf-node-more { background: var(--surface-2); color: var(--text-2); border: 1px solid var(--border); }
    .wf-step-name { color: var(--text-2); font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .wf-foot {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
    }
    .wf-meta { color: var(--text-3); font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem; }
    .wf-arrow { margin-left: auto; color: var(--primary); font-size: 0.8rem; font-weight: 500; display: inline-flex; align-items: center; gap: 0.35rem; transition: gap 0.2s var(--ease); }
    .wf-card:hover .wf-arrow { gap: 0.55rem; }

    @media (max-width: 960px) {
      .launchpad-inner { grid-template-columns: 1fr; gap: 2.5rem; }
      .launchpad-visual { order: -1; }
    }
    @media (max-width: 900px) {
      .trust-strip { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 640px) {
      .launchpad { padding: 3.5rem 1rem 3rem; }
      .search-box { flex-direction: column; align-items: stretch; padding: 0.75rem; }
      .search-btn { justify-content: center; }
      .compass-stage { width: 160px; height: 160px; }
      .compass-label { display: none; }
      .tool-row, .collection-grid, .wf-strip, .oss-list, .gem-grid { grid-template-columns: 1fr; }
      .trust-strip { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  query = '';
  compassAngle = -30;
  activeLabel = 'Coding';
  directions = [
    { label: 'Coding', angle: 0, keywords: ['code', 'build', 'app', 'website', 'develop', 'program', 'software', 'api', 'site'] },
    { label: 'Design', angle: 300, keywords: ['design', 'image', 'photo', 'logo', 'ui', 'brand', 'art', 'background', 'thumbnail', 'poster'] },
    { label: 'Marketing', angle: 60, keywords: ['market', 'seo', 'content', 'social', 'copy', 'ads', 'launch', 'audience', 'campaign', 'email'] },
    { label: 'Video', angle: 120, keywords: ['video', 'clip', 'film', 'edit', 'animation', 'voice', 'caption'] },
    { label: 'Research', angle: 240, keywords: ['research', 'paper', 'study', 'pdf', 'summar', 'read', 'learn', 'notes', 'school', 'exam'] },
    { label: 'Automation', angle: 180, keywords: ['automate', 'workflow', 'pipeline', 'integration', 'agent', 'chatbot', 'assistant', 'transcrib', 'music', 'song'] }
  ];
  trending: Tool[] = [];
  gems: Tool[] = [];
  oss: Tool[] = [];
  collections: Collection[] = [];
  workflows: Workflow[] = [];
  trendingLoading = true;
  gemsLoading = true;
  ossLoading = true;
  collectionsLoading = true;
  wfLoading = true;
  trendingError = false;
  gemsError = false;
  ossError = false;
  collectionsError = false;
  wfError = false;

  quickPrompts = [
    { label: 'Remove backgrounds', query: 'remove background', icon: 'pi-image' },
    { label: 'Make a website', query: 'make a website', icon: 'pi-globe' },
    { label: 'Edit a video', query: 'edit video', icon: 'pi-video' },
    { label: 'Summarize a PDF', query: 'summarize pdf', icon: 'pi-file' },
    { label: 'Generate a song', query: 'make music', icon: 'pi-volume-up' },
    { label: 'Transcribe audio', query: 'transcribe audio', icon: 'pi-microphone' }
  ];

  goals = [
    { label: 'Build a website', hint: 'From landing page to full app', query: 'make a website', icon: 'pi-globe' },
    { label: 'Create videos', hint: 'Edit, caption, generate', query: 'edit video', icon: 'pi-video' },
    { label: 'Generate images', hint: 'Art, posters, backgrounds', query: 'generate images', icon: 'pi-image' },
    { label: 'Write content', hint: 'Emails, posts, drafts', query: 'write content', icon: 'pi-pencil' },
    { label: 'Study & learn', hint: 'Summarize notes and papers', query: 'summarize pdf', icon: 'pi-book' },
    { label: 'Automate work', hint: 'Let AI do the busywork', query: 'automate work', icon: 'pi-bolt' },
    { label: 'Start a business', hint: 'MVPs, landing pages, marketing', query: 'start a business', icon: 'pi-briefcase' },
    { label: 'Code', hint: 'Editors, agents, local models', query: 'code editor', icon: 'pi-code' },
    { label: 'Market your business', hint: 'Posts, ads, voiceover, video', query: 'market my business', icon: 'pi-megaphone' },
    { label: 'Create music', hint: 'Full songs from a prompt', query: 'make music', icon: 'pi-volume-up' }
  ];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadTrending();
    this.loadOss();
    this.loadCollections();
    this.loadWorkflows();
    setTimeout(() => this.compassAngle = 0, 250);
  }

  guessDirection(q: string): { label: string; angle: number } | null {
    const normalized = (q || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalized) return null;
    let best: { label: string; angle: number } | null = null;
    let bestScore = 0;
    for (const dir of this.directions) {
      let score = 0;
      for (const kw of dir.keywords) if (normalized.includes(kw)) score += kw.length;
      if (score > bestScore) { bestScore = score; best = dir; }
    }
    return bestScore >= 4 ? best : null;
  }

  onQueryChange(q: string): void {
    const dir = this.guessDirection(q);
    this.activeLabel = dir ? dir.label : 'Coding';
    this.compassAngle = dir ? dir.angle : 0;
  }

  loadTrending(): void {
    this.trendingLoading = true;
    this.trendingError = false;
    this.api.getTrendingTools().subscribe({
      next: res => {
        this.trending = res.data.slice(0, 6);
        this.trendingLoading = false;
        this.loadGems();
      },
      error: () => {
        this.trendingLoading = false;
        this.trendingError = true;
        this.loadGems();
      }
    });
  }

  private pickGems(all: Tool[]): Tool[] {
    const gems = all.filter(t => t.is_gem);
    const trendingIds = new Set(this.trending.map(t => t.id));
    const fresh = gems.filter(g => !trendingIds.has(g.id));
    return (fresh.length >= 4 ? fresh : gems).slice(0, 4);
  }

  loadGems(): void {
    this.gemsLoading = true;
    this.gemsError = false;
    this.api.getGemTools().subscribe({
      next: res => { this.gems = this.pickGems(res.data); this.gemsLoading = false; },
      error: () => { this.gemsLoading = false; this.gemsError = true; }
    });
  }

  loadCollections(): void {
    this.collectionsLoading = true;
    this.collectionsError = false;
    this.api.getCollections().subscribe({
      next: res => { this.collections = res.data; this.collectionsLoading = false; },
      error: () => { this.collectionsLoading = false; this.collectionsError = true; }
    });
  }

  loadOss(): void {
    this.ossLoading = true;
    this.ossError = false;
    this.api.getCollectionBySlug('open-source-self-hosted').subscribe({
      next: res => { this.oss = res.tools.slice(0, 4); this.ossLoading = false; },
      error: () => { this.ossLoading = false; this.ossError = true; }
    });
  }

  loadWorkflows(): void {
    this.wfLoading = true;
    this.wfError = false;
    this.api.getWorkflows().subscribe({
      next: res => {
        const featured = res.data.filter(w => w.is_featured);
        const rest = res.data.filter(w => !w.is_featured);
        this.workflows = [...featured, ...rest].slice(0, 4);
        this.wfLoading = false;
      },
      error: () => { this.wfLoading = false; this.wfError = true; }
    });
  }

  onSearch(): void {
    if (!this.query.trim()) return;
    this.router.navigate(['/tools'], { queryParams: { q: this.query.trim() } });
  }

  runPrompt(prompt: { query: string }): void {
    this.router.navigate(['/tools'], { queryParams: { q: prompt.query } });
  }

  openTool(tool: Tool): void {
    this.router.navigate(['/tools'], { queryParams: { id: tool.id } });
  }

  reviewedDate(date: string): string {
    const iso = (date || '').split('T')[0];
    const parts = iso.split('-');
    if (parts.length < 2) return date;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    return `${month} ${parts[0]}`;
  }

  pricingSeverity(p: string): 'success' | 'warn' | 'danger' | 'info' {
    return p === 'Free' ? 'success' : p === 'Freemium' ? 'warn' : p === 'Paid' ? 'info' : 'info';
  }
}
