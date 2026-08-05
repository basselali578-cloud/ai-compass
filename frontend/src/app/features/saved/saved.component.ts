import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { SavedTool } from '../../core/models/api.models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { ToolLogoComponent } from '../../shared/components/tool-logo/tool-logo.component';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    TagModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    SkeletonCardComponent,
    ToolLogoComponent
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <h1><i class="pi pi-bookmark-fill" style="color:var(--primary)"></i> My Saved Tools</h1>
        <p>Save now, use this week. Picks clear after 7 days so your list stays fresh instead of becoming a backlog.</p>
      </div>

      <ng-container *ngIf="auth.isLoggedIn; else notLoggedIn">
        <div class="expiry-banner" *ngIf="!loading && !error && savedTools.length > 0">
          <i class="pi pi-clock"></i>
          <span>Saved tools auto-clear <strong>7 days</strong> after you save them. Re-saving a tool resets the timer — open what you need before it expires.</span>
        </div>

        <div class="saved-grid" *ngIf="loading">
          <app-skeleton-card variant="tool" *ngFor="let s of [0,1,2]" [attr.aria-hidden]="true"></app-skeleton-card>
        </div>

        <div class="error-state" *ngIf="error">
          <div class="state-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <h3>Couldn't load your saved tools</h3>
          <button class="btn btn-primary" (click)="loadSaved()"><i class="pi pi-refresh"></i> Try again</button>
        </div>

        <div class="empty-state" *ngIf="!loading && !error && savedTools.length === 0">
          <div class="state-icon"><i class="pi pi-bookmark"></i></div>
          <h3>Nothing saved yet</h3>
          <p>When you see a tool you want to use this week, hit the bookmark. Your picks live here for 7 days.</p>
          <a routerLink="/tools" class="btn btn-primary">Find tools <i class="pi pi-arrow-right"></i></a>
        </div>

        <ng-container *ngIf="!loading && !error && savedTools.length > 0">
          <div class="saved-grid">
            <div *ngFor="let tool of savedTools" class="saved-card">
              <div class="card-top">
                <app-tool-logo [name]="tool.name" [size]="48"></app-tool-logo>
                <div class="card-actions">
                  <button class="icon-btn" aria-label="Edit note" [pTooltip]="'Edit note'" tooltipPosition="top" (click)="openNoteDialog(tool)"><i class="pi pi-pencil"></i></button>
                  <button class="icon-btn danger" aria-label="Remove from saved" [pTooltip]="'Remove'" tooltipPosition="top" (click)="remove(tool)"><i class="pi pi-trash"></i></button>
                </div>
              </div>
              <h3>{{ tool.name }}</h3>
              <p class="best-for">{{ tool.best_for }}</p>
              <div class="note-box" *ngIf="tool.note" (click)="openNoteDialog(tool)" role="button" tabindex="0" (keydown.enter)="openNoteDialog(tool)">
                <i class="pi pi-sticky-note"></i>
                <span>{{ tool.note }}</span>
              </div>
              <div class="card-tags">
                <p-tag [value]="tool.pricing" [severity]="pricingSeverity(tool.pricing)"></p-tag>
                <p-tag *ngIf="tool.beginner_friendly" value="Beginner friendly" severity="info"></p-tag>
              </div>
              <div class="card-footer">
                <span class="expiry" [class.warn]="tool.expires_in_days <= 2"><i class="pi pi-clock"></i> Expires in {{ expiresIn(tool) }}</span>
                <a [href]="tool.url" target="_blank" rel="noopener" class="visit-link">Visit <i class="pi pi-external-link"></i></a>
              </div>
            </div>
          </div>
        </ng-container>
      </ng-container>

      <ng-template #notLoggedIn>
        <div class="empty-state">
          <div class="state-icon"><i class="pi pi-lock"></i></div>
          <h3>Sign in to see your saved tools</h3>
          <p>Your bookmarks are tied to your account.</p>
          <a routerLink="/auth/login" class="btn btn-primary">Sign in <i class="pi pi-arrow-right"></i></a>
        </div>
      </ng-template>

      <p-dialog [(visible)]="noteDialogVisible" [modal]="true" [style]="{width: '480px'}" [draggable]="false" header="Edit Note">
        <div class="note-dialog">
          <label for="note-text">What do you want to use this for?</label>
          <input pInputText id="note-text" [(ngModel)]="noteText" placeholder="e.g. Use for YouTube thumbnails" class="note-input">
          <p class="hint">Write it down while it's fresh — saved tools clear after 7 days.</p>
        </div>
        <ng-template #footer>
          <p-button label="Cancel" styleClass="p-button-text" (onClick)="noteDialogVisible = false"></p-button>
          <p-button label="Save" (onClick)="saveNote()"></p-button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { color: var(--text-1); font-size: clamp(1.7rem, 3vw, 2.1rem); font-weight: 800; letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.75rem; }
    .page-header p { color: var(--text-2); margin-top: 0.5rem; font-size: 0.95rem; }
    .expiry-banner {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: var(--primary-soft);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #c7d2fe;
      border-radius: var(--radius-sm);
      padding: 0.875rem 1.1rem;
      font-size: 0.85rem;
      line-height: 1.55;
      margin-bottom: 1.5rem;
    }
    .expiry-banner i { color: var(--primary); font-size: 1rem; flex-shrink: 0; }
    .expiry-banner strong { color: #fff; }
    .saved-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .saved-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.5rem;
    }
    .saved-card:hover { background: var(--surface-2); }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .card-actions { display: flex; gap: 0.5rem; }
    .icon-btn {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      color: var(--text-2);
      cursor: pointer;
      transition: all 0.2s var(--ease);
    }
    .icon-btn:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); }
    .icon-btn.danger:hover { border-color: #ef4444; color: #ef4444; }
    .saved-card h3 { color: var(--text-1); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .best-for { color: #a5b4fc; font-size: 0.9rem; line-height: 1.5; margin-bottom: 0.75rem; }
    .note-box {
      background: var(--primary-soft);
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: var(--radius-sm);
      padding: 0.75rem;
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
      color: #c7d2fe;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      cursor: pointer;
      transition: border-color 0.18s var(--ease);
    }
    .note-box:hover { border-color: var(--primary); }
    .note-box i { color: var(--primary); margin-top: 0.125rem; }
    .card-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .expiry { color: var(--text-3); font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.375rem; }
    .expiry i { color: var(--primary); font-size: 0.85rem; }
    .expiry.warn { color: #fbbf24; }
    .expiry.warn i { color: #fbbf24; }
    .visit-link { color: var(--primary); text-decoration: none; font-size: 0.875rem; font-weight: 500; display: inline-flex; align-items: center; gap: 0.375rem; transition: gap 0.2s var(--ease); }
    .visit-link:hover { gap: 0.6rem; }
    .note-dialog label { display: block; color: var(--text-2); font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
    .note-input { width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text-1); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 0.75rem; }
    .note-input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.16); }
    .hint { color: var(--text-3); font-size: 0.8rem; margin-top: 0.5rem; }
    @media (max-width: 640px) { .saved-grid { grid-template-columns: 1fr; } }
  `]
})
export class SavedComponent implements OnInit {
  savedTools: SavedTool[] = [];
  loading = true;
  error = false;
  noteDialogVisible = false;
  noteText = '';
  noteTarget: SavedTool | null = null;

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private router: Router,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn) {
      this.loading = false;
      return;
    }
    this.loadSaved();
  }

  loadSaved(): void {
    this.loading = true;
    this.error = false;
    this.api.getSavedTools().subscribe({
      next: res => {
        this.savedTools = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  remove(tool: SavedTool): void {
    this.api.unsaveTool(tool.id).subscribe(() => {
      this.savedTools = this.savedTools.filter(t => t.id !== tool.id);
      this.message.add({ severity: 'success', summary: 'Removed', detail: `${tool.name} was removed from your saved tools.` });
    });
  }

  openNoteDialog(tool: SavedTool): void {
    this.noteTarget = tool;
    this.noteText = tool.note || '';
    this.noteDialogVisible = true;
  }

  saveNote(): void {
    if (!this.noteTarget) return;
    this.api.saveTool(this.noteTarget.id, this.noteText).subscribe(() => {
      this.noteTarget!.note = this.noteText;
      this.noteDialogVisible = false;
      this.message.add({ severity: 'success', summary: 'Updated', detail: 'Note saved.' });
    });
  }

  expiresIn(tool: SavedTool): string {
    const days = tool.expires_in_days;
    if (days === null || days === undefined) return '7 days';
    if (days <= 0) return 'today';
    if (days === 1) return '1 day';
    return `${days} days`;
  }

  pricingSeverity(p: string): 'success' | 'warn' | 'danger' | 'info' {
    return p === 'Free' ? 'success' : p === 'Freemium' ? 'warn' : p === 'Paid' ? 'info' : 'info';
  }
}
