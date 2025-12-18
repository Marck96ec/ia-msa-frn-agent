import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService } from '@core/services';
import { EventHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, EventHeaderComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-baby-yellow/20 to-baby-green/20">
      <app-event-header 
        [eventName]="eventName"
        subtitle="¿Cómo quieres participar?"
        [showBack]="true"
        [backRoute]="'/e/' + slug + '/rsvp'" />

      <div class="max-w-2xl mx-auto px-6 py-8">
        <div class="text-center mb-8 animate-slide-up">
          <div class="text-6xl mb-4">💝</div>
          <h2 class="text-3xl font-bold text-gray-800 mb-3 text-balance">
            Tu presencia ya es un regalo
          </h2>
          <p class="text-gray-600 text-lg">
            Pero si quieres colaborar de alguna forma, aquí tienes algunas opciones
          </p>
        </div>

        <div class="space-y-4 animate-slide-up">
          <!-- Elegir Regalo -->
          <button 
            (click)="navigate('gifts')"
            class="w-full bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all text-left group">
            <div class="flex items-center gap-4">
              <div class="text-5xl group-hover:scale-110 transition-transform">🎁</div>
              <div class="flex-1">
                <div class="text-xl font-bold text-gray-800 mb-1">Ver lista de regalos</div>
                <div class="text-gray-600">
                  Elige algo de nuestra lista y háznoslo saber
                </div>
              </div>
              <div class="text-gray-400">→</div>
            </div>
          </button>

          <!-- Dejar Idea -->
          <button 
            (click)="navigate('ideas')"
            class="w-full bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all text-left group">
            <div class="flex items-center gap-4">
              <div class="text-5xl group-hover:scale-110 transition-transform">💡</div>
              <div class="flex-1">
                <div class="text-xl font-bold text-gray-800 mb-1">Sugerir una idea</div>
                <div class="text-gray-600">
                  ¿Tienes alguna sugerencia de regalo? Déjanosla saber
                </div>
              </div>
              <div class="text-gray-400">→</div>
            </div>
          </button>

          <!-- Mensaje para el Bebé -->
          <button 
            (click)="navigate('baby-message')"
            class="w-full bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all text-left group">
            <div class="flex items-center gap-4">
              <div class="text-5xl group-hover:scale-110 transition-transform">👶</div>
              <div class="flex-1">
                <div class="text-xl font-bold text-gray-800 mb-1">Mensaje para el bebé</div>
                <div class="text-gray-600">
                  Déjale unas palabras de bienvenida al pequeñito
                </div>
              </div>
              <div class="text-gray-400">→</div>
            </div>
          </button>

          <!-- Omitir -->
          <button 
            (click)="navigate('thanks')"
            class="w-full mt-6 btn-outline">
            Continuar sin elegir
          </button>
        </div>
      </div>
    </div>
  `
})
export class SupportComponent implements OnInit {
  slug: string = '';
  eventName: string = 'Baby Shower';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const event = this.stateService.getCurrentEvent();
    if (event) {
      this.eventName = `Baby Shower de ${event.babyName}`;
    }
  }

  navigate(path: string): void {
    this.router.navigate([`/e/${this.slug}/${path}`]);
  }
}
