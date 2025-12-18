import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-soft sticky top-0 z-50">
      <div class="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="text-3xl">🍼</div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">{{ eventName }}</h1>
            <p *ngIf="subtitle" class="text-xs text-gray-500">{{ subtitle }}</p>
          </div>
        </div>
        <button 
          *ngIf="showBack"
          [routerLink]="backRoute"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
      </div>
    </header>
  `
})
export class EventHeaderComponent {
  @Input() eventName: string = 'Baby Shower';
  @Input() subtitle?: string;
  @Input() showBack: boolean = false;
  @Input() backRoute: string = '/';
}
