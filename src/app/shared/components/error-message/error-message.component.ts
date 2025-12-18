import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ErrorInfo {
  message: string;
  title?: string;
  showRetry?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card max-w-md mx-auto text-center">
      <div class="text-6xl mb-4">{{ error.icon || '😔' }}</div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">
        {{ error.title || 'Algo no salió como esperábamos' }}
      </h3>
      <p class="text-gray-600 mb-6">{{ error.message }}</p>
      <button 
        *ngIf="error.showRetry !== false"
        type="button"
        (click)="retry.emit()"
        class="btn-primary">
        Intentar nuevamente
      </button>
    </div>
  `
})
export class ErrorMessageComponent {
  @Input() error: ErrorInfo = {
    message: 'Por favor, intenta nuevamente en unos momentos.'
  };
  @Output() retry = new EventEmitter<void>();
}
