import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card max-w-md mx-auto text-center animate-bounce-soft">
      <div class="text-6xl mb-4">{{ icon }}</div>
      <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ title }}</h3>
      <p class="text-gray-600 text-lg">{{ message }}</p>
    </div>
  `
})
export class SuccessMessageComponent {
  @Input() title: string = '¡Listo!';
  @Input() message: string = 'Todo salió perfecto';
  @Input() icon: string = '✨';
}
