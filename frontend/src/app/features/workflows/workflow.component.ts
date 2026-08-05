import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Workflow, WorkflowStep } from '../../core/models/api.models';
import { ToolLogoComponent } from '../../shared/components/tool-logo/tool-logo.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolLogoComponent, SkeletonCardComponent],
  template: `
    <div class="container">
      <a routerLink="/workflows" class="back-link"><i class="pi pi-arrow-left"></i> All workflows</a>

      <ng-container *ngIf="workflow && !loading && !error">
        <div class="hero" [style.borderColor]="workflow.color + '44'">
          <div class="hero-icon" [style.background]="workflow.color + '22'" [style.color]="workflow.color">
            <i class="pi {{ workflow.icon }}"></i>
          </div>
          <div class="hero-text">
            <div class="hero-tags">
              <span class="featured-chip" *ngIf="workflow.is_featured" [style.background]="workflow.color + '22'" [style.color]="workflow.color"><i class="pi pi-star-fill"></i> Starter</span>
              <span class="meta-chip"><i class="pi pi-chart-line"></i> {{ workflow.difficulty }}</span>
              <span class="meta-chip"><i class="pi pi-wallet"></i> {{ workflow.cost }}</span>
              <span class="meta-chip" *ngIf="workflow.time_label"><i class="pi pi-clock"></i> {{ workflow.time_label }}</span>
            </div>
            <h1>{{ workflow.title }}</h1>
            <p class="goal">{{ workflow.goal }}</p>
            <p class="summary">{{ workflow.summary }}</p>
          </div>
        </div>

        <div class="why-stack" *ngIf="workflow.why && workflow.why.length">
          <h2 class="block-title"><i class="pi pi-question-circle"></i> Why this stack?</h2>
          <ul class="why-list">
            <li *ngFor="let w of workflow.why"><i class="pi pi-check-circle"></i> {{ w }}</li>
          </ul>
          <div class="alt-stacks" *ngIf="workflow.alternative_stacks?.length">
            <span class="alt-label"><i class="pi pi-arrow-right-arrow-left"></i> Different situation?</span>
            <span *ngFor="let a of workflow.alternative_stacks" class="alt-chip">{{ a }}</span>
          </div>
        </div>

        <div class="steps-wrap">
          <h2 class="steps-title">The stack</h2>
          <ol class="steps">
            <li *ngFor="let step of workflow.steps; let i = index" class="step" [class.external]="!step.tool_id">
              <div class="step-rail">
                <span class="step-num" [style.borderColor]="workflow.color + '66'" [style.color]="workflow.color">{{ i + 1 }}</span>
                <span class="step-line" *ngIf="!isLast(step)"></span>
              </div>
              <div class="step-body">
                <div class="step-top">
                  <app-tool-logo *ngIf="step.tool_id" [name]="step.title" [size]="34"></app-tool-logo>
                  <span class="step-icon" *ngIf="!step.tool_id"><i class="pi pi-link"></i></span>
                  <h3>{{ step.title }}</h3>
                  <span class="linked-chip" *ngIf="step.tool_id">in AI Compass</span>
                  <span class="linked-chip external" *ngIf="!step.tool_id">external</span>
                </div>
                <p class="step-note">{{ step.note }}</p>
                <div class="why-box" *ngIf="hasReasoning(step)">
                  <div class="why-row" *ngIf="step.why"><i class="pi pi-check-circle"></i> <strong>Why?</strong> <span>{{ step.why }}</span></div>
                  <div class="why-row" *ngIf="step.alternative"><i class="pi pi-arrow-right-arrow-left"></i> <strong>Alternative:</strong> <span>{{ step.alternative }}</span></div>
                  <div class="why-row avoid" *ngIf="step.avoid_if"><i class="pi pi-exclamation-circle"></i> <strong>Avoid if:</strong> <span>{{ step.avoid_if }}</span></div>
                </div>
                <button
                  *ngIf="step.tool_id"
                  class="open-link"
                  [attr.aria-label]="'Open ' + step.title + ' in AI Compass'"
                  (click)="openTool(step)">
                  Open {{ step.title }} <i class="pi pi-arrow-right"></i>
                </button>
              </div>
            </li>
          </ol>
        </div>
      </ng-container>

      <div class="steps-wrap" *ngIf="loading">
        <app-skeleton-card variant="tool-pill" *ngFor="let s of [0,1,2,3,4,5]" [attr.aria-hidden]="true"></app-skeleton-card>
      </div>

      <div class="error-state" *ngIf="error">
        <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
        <h3>Couldn't load this workflow</h3>
        <button class="btn btn-primary" (click)="load()"><i class="pi pi-refresh"></i> Try again</button>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && !workflow">
        <div class="state-icon"><i class="pi pi-sitemap"></i></div>
        <h3>Workflow not found</h3>
        <p>This stack may have been renamed or retired.</p>
        <a routerLink="/workflows" class="btn btn-primary">Browse workflows <i class="pi pi-arrow-right"></i></a>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }
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
      margin-bottom: 2.25rem;
      box-shadow: 0 20px 50px -25px rgba(0,0,0,.6);
    }
    .hero-icon {
      width: 60px; height: 60px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem;
      flex-shrink: 0;
    }
    .hero-text h1 { color: var(--text-1); font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 800; letter-spacing: -0.02em; margin: 0.6rem 0 0.4rem; }
    .goal { color: #a5b4fc; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem; }
    .summary { color: var(--text-2); font-size: 0.92rem; line-height: 1.6; }
    .hero-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .featured-chip {
      font-size: 0.7rem; font-weight: 700;
      border-radius: 999px; padding: 0.3rem 0.65rem;
      display: inline-flex; align-items: center; gap: 0.35rem;
    }
    .meta-chip {
      font-size: 0.72rem; font-weight: 600;
      color: var(--text-2);
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 999px; padding: 0.3rem 0.65rem;
      display: inline-flex; align-items: center; gap: 0.35rem;
    }
    .why-stack {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-left: 3px solid var(--primary);
      border-radius: 14px;
      padding: 1.5rem 1.75rem;
      margin-bottom: 2.25rem;
    }
    .block-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-1);
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .block-title i { color: var(--primary); }
    .why-list { list-style: none; padding: 0; margin: 0 0 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .why-list li {
      display: flex;
      gap: 0.6rem;
      align-items: flex-start;
      color: var(--text-2);
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .why-list li i { color: var(--success); margin-top: 0.2rem; font-size: 0.85rem; flex-shrink: 0; }
    .alt-stacks { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
    .alt-label { color: var(--text-3); font-size: 0.78rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem; }
    .alt-label i { color: var(--primary); font-size: 0.75rem; }
    .alt-chip {
      font-size: 0.72rem; font-weight: 600;
      color: var(--text-2);
      background: var(--surface-2);
      border: 1px dashed var(--border);
      border-radius: 999px; padding: 0.3rem 0.7rem;
      white-space: nowrap;
    }
    .steps-title { color: var(--text-1); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.1rem; }
    .steps { list-style: none; padding: 0; margin: 0; }
    .step { display: flex; gap: 1.1rem; }
    .step-rail { display: flex; flex-direction: column; align-items: center; }
    .step-num {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: var(--surface-1);
      border: 2px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; font-weight: 700;
      flex-shrink: 0;
    }
    .step-line { width: 2px; flex: 1; background: var(--border); margin: 0.35rem 0; }
    .step-body {
      flex: 1;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem 1.4rem;
      margin-bottom: 1rem;
      transition: border-color 0.2s var(--ease), transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
    }
    .step:hover .step-body { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-lift); }
    .step-top { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
    .step-icon {
      width: 34px; height: 34px;
      border-radius: 9px;
      background: var(--surface-2);
      border: 1px dashed var(--border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-3); font-size: 0.9rem;
      flex-shrink: 0;
    }
    .step-top h3 { color: var(--text-1); font-size: 1.05rem; font-weight: 700; }
    .linked-chip {
      font-size: 0.65rem; font-weight: 700;
      color: var(--primary);
      background: var(--primary-soft);
      border-radius: 999px; padding: 0.2rem 0.55rem;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .linked-chip.external { color: var(--text-3); background: var(--surface-2); }
    .step-note { color: var(--text-2); font-size: 0.88rem; line-height: 1.6; margin-bottom: 0.75rem; }
    .why-box {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.9rem;
      padding: 0.9rem 1rem;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 10px;
    }
    .why-row { display: flex; gap: 0.55rem; align-items: flex-start; color: var(--text-2); font-size: 0.84rem; line-height: 1.55; }
    .why-row i { color: var(--primary); margin-top: 0.2rem; font-size: 0.8rem; flex-shrink: 0; }
    .why-row.avoid i { color: #f59e0b; }
    .why-row strong { color: var(--text-1); font-weight: 600; flex-shrink: 0; }
    .open-link {
      background: none; border: none; cursor: pointer;
      color: var(--primary); font-size: 0.85rem; font-weight: 600;
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0;
      font-family: inherit;
      transition: gap 0.2s var(--ease);
    }
    .open-link:hover { gap: 0.6rem; }
    .error-state h3 { color: var(--text-1); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; }
    @media (max-width: 640px) {
      .hero { flex-direction: column; }
      .step-body { padding: 1rem 1.1rem; }
    }
  `]
})
export class WorkflowComponent implements OnInit {
  workflow: Workflow | null = null;
  loading = true;
  error = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => this.load());
  }

  load(): void {
    this.loading = true;
    this.error = false;
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) { this.loading = false; return; }
    this.api.getWorkflowBySlug(slug).subscribe({
      next: res => { this.workflow = res; this.loading = false; },
      error: () => { this.loading = false; this.error = true; }
    });
  }

  isLast(step: WorkflowStep): boolean {
    return !!this.workflow && this.workflow.steps![this.workflow.steps!.length - 1].id === step.id;
  }

  hasReasoning(step: WorkflowStep): boolean {
    return !!(step.why || step.alternative || step.avoid_if);
  }

  openTool(step: WorkflowStep): void {
    if (!step.tool_id) return;
    this.router.navigate(['/tools'], { queryParams: { id: step.tool_id } });
  }
}
