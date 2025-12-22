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
    <div class="min-h-screen bg-gradient-to-br from-amber-50/80 via-rose-50/50 to-sky-50/60">
      <app-event-header
        [eventName]="eventName"
        subtitle="Formas de acompañarnos"
        [showBack]="true"
        [backRoute]="'/e/' + slug + '/rsvp'"
      />

      <div class="max-w-2xl mx-auto px-6 py-8">
        <!-- Mensaje principal emocional -->
        <div class="text-center mb-10 animate-fade-in">
          <div class="relative inline-block mb-4">
            <span class="text-7xl animate-float">💛</span>
            <span class="absolute -top-1 -right-3 text-2xl animate-pulse-soft">✨</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-800 mb-4 text-balance leading-relaxed">
            Tu presencia ya es un regalo
          </h2>
          <p class="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            Si deseas acompañarnos de alguna otra forma, aquí te dejamos algunas opciones
          </p>
        </div>

        <!-- Cards de opciones -->
        <div class="space-y-4 mb-8">
          <!-- Ver lista de regalos -->
          <button
            (click)="navigate('gifts')"
            class="option-card group animate-fade-in-delay"
            aria-label="Ver lista de regalos"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center transition-smooth group-hover:scale-105"
              >
                <span class="text-3xl">🎁</span>
              </div>
              <div class="flex-1 text-left">
                <div class="text-lg font-semibold text-gray-800 mb-0.5">Ver lista de regalos</div>
                <div class="text-gray-500 text-sm leading-relaxed">
                  Puedes elegir algo que nos ayude en esta nueva etapa
                </div>
              </div>
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-smooth group-hover:bg-amber-100 group-hover:translate-x-1"
              >
                <span class="text-gray-400 group-hover:text-amber-600 transition-smooth">→</span>
              </div>
            </div>
          </button>

          <!-- Proponer una idea -->
          <button
            (click)="navigate('ideas')"
            class="option-card group animate-fade-in-delay-2"
            aria-label="Proponer una idea de regalo"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center transition-smooth group-hover:scale-105"
              >
                <span class="text-3xl">💡</span>
              </div>
              <div class="flex-1 text-left">
                <div class="text-lg font-semibold text-gray-800 mb-0.5">Proponer una idea</div>
                <div class="text-gray-500 text-sm leading-relaxed">
                  ¿Tienes algo especial en mente? Nos encantará leerlo
                </div>
              </div>
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-smooth group-hover:bg-rose-100 group-hover:translate-x-1"
              >
                <span class="text-gray-400 group-hover:text-rose-600 transition-smooth">→</span>
              </div>
            </div>
          </button>

          <!-- Mensaje para el bebé -->
          <button
            (click)="navigate('baby-message')"
            class="option-card group animate-fade-in-delay-3"
            aria-label="Dejar un mensaje para el bebé"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center transition-smooth group-hover:scale-105"
              >
                <span class="text-3xl">💌</span>
              </div>
              <div class="flex-1 text-left">
                <div class="text-lg font-semibold text-gray-800 mb-0.5">Dejar un mensaje para {{ babyName }}</div>
                <div class="text-gray-500 text-sm leading-relaxed">
                  Escríbele unas palabras que podrá leer cuando sea grande
                </div>
              </div>
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-smooth group-hover:bg-sky-100 group-hover:translate-x-1"
              >
                <span class="text-gray-400 group-hover:text-sky-600 transition-smooth">→</span>
              </div>
            </div>
          </button>
        </div>

        <!-- CTA secundario sin presión -->
        <div class="text-center animate-fade-in-delay-3">
          <button
            (click)="navigate('thanks')"
            class="inline-flex items-center gap-2 px-6 py-3 text-gray-500 hover:text-gray-700 transition-smooth group"
            aria-label="Continuar solo con mi presencia"
          >
            <span class="text-sm font-medium">Por ahora, solo quiero acompañarlos</span>
            <span class="text-lg opacity-70 group-hover:opacity-100 transition-smooth">💙</span>
          </button>
          <p class="text-xs text-gray-400 mt-2">Siempre puedes volver a estas opciones después</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulseSoft {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
      }
      .animate-float {
        animation: float 2.5s ease-in-out infinite;
      }
      .animate-fade-in {
        animation: fadeIn 0.2s ease-out forwards;
      }
      .animate-fade-in-delay {
        animation: fadeIn 0.2s ease-out 0.05s forwards;
        opacity: 0;
      }
      .animate-fade-in-delay-2 {
        animation: fadeIn 0.2s ease-out 0.1s forwards;
        opacity: 0;
      }
      .animate-fade-in-delay-3 {
        animation: fadeIn 0.2s ease-out 0.15s forwards;
        opacity: 0;
      }
      .animate-pulse-soft {
        animation: pulseSoft 2s ease-in-out infinite;
      }
      .transition-smooth {
        transition: all 0.2s ease-out;
      }
      .option-card {
        width: 100%;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 1.25rem;
        padding: 1.25rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: all 0.2s ease-out;
        cursor: pointer;
      }
      .option-card:hover {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }
      .option-card:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.4);
      }
      .option-card:active {
        transform: scale(0.98);
      }
    `
  ]
})
export class SupportComponent implements OnInit {
  slug = '';
  eventName = 'Baby Shower';
  babyName = 'el bebé';

  constructor(private route: ActivatedRoute, private router: Router, private stateService: StateService) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const event = this.stateService.getCurrentEvent();
    if (event) {
      this.eventName = `Baby Shower de ${event.babyName}`;
      this.babyName = event.babyName || 'el bebé';
    }
  }

  navigate(path: string): void {
    this.router.navigate([`/e/${this.slug}/${path}`]);
  }
}
