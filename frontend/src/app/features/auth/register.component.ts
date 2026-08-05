import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InputTextModule, ButtonModule, PasswordModule, MessagesModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <a routerLink="/" class="back-home"><i class="pi pi-arrow-left"></i> Back to AI Compass</a>
        <div class="auth-header">
          <div class="brand-mark"><i class="pi pi-compass"></i></div>
          <h1>Create your account</h1>
          <p>Start your bookmark brain in 30 seconds</p>
        </div>

        <p-messages [(value)]="messages" [enableService]="false"></p-messages>

        <form #regForm="ngForm" (ngSubmit)="onSubmit(regForm)" novalidate>
          <div class="form-group">
            <label for="username">Username</label>
            <input pInputText id="username" [(ngModel)]="username" name="username" #usernameModel="ngModel" placeholder="johndoe" class="form-input" required minlength="3" autocomplete="username">
            <small *ngIf="usernameModel.invalid && usernameModel.touched" class="field-error">
              <ng-container *ngIf="usernameModel.errors?.['required']">Username is required</ng-container>
              <ng-container *ngIf="usernameModel.errors?.['minlength']">At least 3 characters</ng-container>
            </small>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input pInputText id="email" [(ngModel)]="email" name="email" #emailModel="ngModel" type="email" placeholder="you@example.com" class="form-input" required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}" autocomplete="email">
            <small *ngIf="emailModel.invalid && emailModel.touched" class="field-error">
              <ng-container *ngIf="emailModel.errors?.['required']">Email is required</ng-container>
              <ng-container *ngIf="emailModel.errors?.['pattern']">Enter a valid email</ng-container>
            </small>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input pInputText id="password" [(ngModel)]="password" name="password" #passwordModel="ngModel" type="password" placeholder="Min 6 characters" class="form-input" required minlength="6" autocomplete="new-password">
            <small *ngIf="passwordModel.invalid && passwordModel.touched" class="field-error">
              <ng-container *ngIf="passwordModel.errors?.['required']">Password is required</ng-container>
              <ng-container *ngIf="passwordModel.errors?.['minlength']">At least 6 characters</ng-container>
            </small>
          </div>

          <p-button label="Create Account" icon="pi pi-user-plus" type="submit" [loading]="loading" styleClass="full-width" [style]="{'width':'100%'}" [disabled]="loading"></p-button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 82vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }
    .auth-card {
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 30px 70px -30px rgba(0,0,0,.7);
      animation: dialogIn 0.3s var(--ease);
      position: relative;
    }
    .back-home {
      position: absolute;
      top: 1.25rem;
      left: 1.5rem;
      color: var(--text-3);
      text-decoration: none;
      font-size: 0.78rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: color 0.18s var(--ease);
    }
    .back-home:hover { color: var(--primary); }
    .auth-header { text-align: center; margin: 1.5rem 0 2rem; }
    .brand-mark {
      width: 52px; height: 52px;
      margin: 0 auto 1rem;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 1.4rem;
      box-shadow: 0 10px 24px -10px var(--primary-glow);
    }
    .auth-header h1 { color: var(--text-1); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
    .auth-header p { color: var(--text-2); font-size: 0.9rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label {
      display: block;
      color: var(--text-2);
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .form-input {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text-1);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      transition: border-color 0.18s var(--ease), box-shadow 0.18s var(--ease);
    }
    .form-input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.16); }
    .form-input.ng-invalid.ng-touched { border-color: #ef4444; }
    .field-error {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.375rem;
      display: block;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--text-3);
      font-size: 0.875rem;
    }
    .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
    :host ::ng-deep .p-button.p-button-primary { width: 100%; }
    :host ::ng-deep .p-message { border-radius: 10px; margin-bottom: 1rem; }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  loading = false;
  messages: any[] = [];
  private auth = inject(AuthService);
  private router = inject(Router);
  private message = inject(MessageService);

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;
    this.messages = [];
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.message.add({ severity: 'success', summary: 'Welcome aboard!', detail: 'Your account is ready. Start saving tools.' });
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading = false;
        this.messages = [{ severity: 'error', detail: err.error?.error || 'Registration failed. Please try again.' }];
      }
    });
  }
}
