import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastModule],
  animations: [
    trigger('routeFade', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(8px)' }),
          animate('0.28s cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <div [@routeFade]="outlet && outlet.isActivated ? outlet.activatedRoute : ''">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </main>
    <app-footer></app-footer>
    <p-toast position="bottom-right"></p-toast>
  `,
  styles: [`
    main { min-height: 80vh; }
  `]
})
export class AppComponent {}
