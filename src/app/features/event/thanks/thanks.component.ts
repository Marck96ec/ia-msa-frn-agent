import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from '@core/services';

@Component({
  selector: 'app-thanks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-baby-pink/30 via-baby-blue/20 to-baby-yellow/30 flex items-center justify-center px-6"
    >
      <div class="max-w-2xl w-full animate-slide-up">
        <div class="text-center mb-8">
          <div class="text-8xl mb-6 animate-bounce-soft">🎉</div>
          <h1 class="text-4xl font-bold text-gray-800 mb-4 text-balance">¡Muchísimas gracias!</h1>
          <p class="text-xl text-gray-600 text-balance">
            Tu participación hace que este momento sea aún más especial para nosotros 💕
          </p>
        </div>

        <div class="card mb-6">
          <p class="text-gray-700 text-center text-lg">
            Nos vemos pronto en la celebración.
            <br />¡Será un día inolvidable!
          </p>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <button (click)="navigate('welcome')" class="btn-outline flex flex-col items-center py-4">
            <span class="text-3xl mb-2">📋</span>
            <span class="text-sm">Ver detalles</span>
          </button>

          <button (click)="openLocation()" class="btn-outline flex flex-col items-center py-4">
            <span class="text-3xl mb-2">📍</span>
            <span class="text-sm">Ubicación</span>
          </button>

          <button (click)="navigate('gifts')" class="btn-outline flex flex-col items-center py-4">
            <span class="text-3xl mb-2">🎁</span>
            <span class="text-sm">Regalos</span>
          </button>

          <button (click)="navigate('chat')" class="btn-outline flex flex-col items-center py-4">
            <span class="text-3xl mb-2">💬</span>
            <span class="text-sm">Dudas</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-500">Hecho con ❤️ por el equipo Baby Shower</p>
        </div>
      </div>
    </div>
  `
})
export class ThanksComponent implements OnInit {
  slug: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private stateService: StateService) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
  }

  navigate(path: string): void {
    this.router.navigate([`/e/${this.slug}/${path}`]);
  }

  openLocation(): void {
    const event = this.stateService.getCurrentEvent();
    if (event?.locationUrl) {
      window.open(event.locationUrl, '_blank');
    } else {
      this.navigate('welcome');
    }
  }
}
