import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class.min-h-screen]="fullScreen" [class.py-8]="!fullScreen">
      <div class="text-center">
        <div class="spinner mx-auto"></div>
        <p *ngIf="message" class="mt-4 text-gray-600 animate-pulse">{{ message }}</p>
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Cargando...';
  @Input() fullScreen: boolean = false;
}
