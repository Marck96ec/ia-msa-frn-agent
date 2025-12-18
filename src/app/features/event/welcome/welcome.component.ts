import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService, StateService } from '@core/services';
import { Event } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent, FooterActionsComponent } from '@shared/components';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorMessageComponent, FooterActionsComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-loading-spinner *ngIf="loading" [fullScreen]="true" message="Preparando todo para ti..." />

      <app-error-message *ngIf="error" [error]="error" (retry)="loadEvent()" />

      <div *ngIf="!loading && !error && event" class="flex-1 pb-32">
        <!-- Hero Image -->
        <div class="relative h-72 bg-gradient-to-br from-baby-pink to-baby-blue overflow-hidden">
          <img
            *ngIf="event.imageUrl"
            [src]="event.imageUrl"
            [alt]="event.name"
            class="w-full h-full object-cover object-center scale-105"
          />
          <div
            class="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-transparent backdrop-blur-[1px]"
          ></div>
          <div class="absolute bottom-6 left-6 right-6 text-white drop-shadow-lg">
            <div class="text-5xl mb-2">🍼</div>
            <h1 class="text-3xl font-bold text-balance">{{ event.name }}</h1>
          </div>
        </div>

        <!-- Context chips -->
        <div class="-mt-6 px-6">
          <div
            class="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-soft rounded-2xl border border-white/70 px-4 py-3 flex flex-wrap gap-3 text-sm text-gray-800"
          >
            <span class="chip-active flex items-center gap-2 text-base h-11 px-3"
              ><span class="text-lg">📅</span>{{ formatDate(event.eventDate) }}</span
            >
            <span class="chip flex items-center gap-2 text-base h-11 px-3"
              ><span class="text-lg">⏰</span>{{ formatTime(event.eventDate) }}</span
            >
            <span class="chip flex items-center gap-2 text-base h-11 px-3"
              ><span class="text-lg">📍</span>{{ event.location }}</span
            >
          </div>
        </div>

        <!-- Welcome Message -->
        <div class="px-6 py-8 max-w-2xl mx-auto space-y-6">
          <div class="card mb-6">
            <p class="text-xl text-gray-700 leading-relaxed text-balance">
              {{
                event.welcomeMessage ||
                  'Te invitamos con mucho cariño a compartir este momento especial. Tu presencia ya es el mejor regalo 💝'
              }}
            </p>
          </div>

          <!-- Event Details -->
          <div class="space-y-3">
            <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide px-1">Detalles</h2>

            <!-- Location only (date/time ya están en chips) -->
            <div class="card-sm flex items-start gap-4">
              <div class="text-3xl">📍</div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 mb-1">Dónde nos vemos</h3>
                <p class="text-gray-700 font-semibold">{{ event.location }}</p>
                <p class="text-gray-500 text-sm">Toca para abrir en Maps</p>
                <button *ngIf="event.locationUrl" (click)="openMaps()" class="mt-3 btn-primary w-full justify-center">
                  Abrir en Maps
                </button>
              </div>
            </div>

            <!-- Description -->
            <div *ngIf="event.description" class="card-sm">
              <p class="text-gray-600 italic">{{ event.description }}</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="pt-2 space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <button (click)="navigate('gifts')" class="btn-outline flex items-center justify-center gap-2 py-3">
                <span class="text-xl">🎁</span>
                <span class="text-sm font-semibold">Ver regalos</span>
              </button>
              <button (click)="navigate('chat')" class="btn-outline flex items-center justify-center gap-2 py-3">
                <span class="text-xl">💬</span>
                <span class="text-sm font-semibold">¿Dudas?</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <app-footer-actions
        *ngIf="event"
        [actions]="[{ label: 'Registrar mi asistencia', action: 'continue', icon: '✨', primary: true }]"
        (actionClicked)="onContinue()"
      />
    </div>
  `
})
export class WelcomeComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: any = null;
  private slug: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.loadEvent();
  }

  loadEvent(): void {
    this.loading = true;
    this.error = null;

    this.eventService.getEventBySlug(this.slug).subscribe({
      next: event => {
        this.event = event;
        this.stateService.setCurrentEvent(event);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error('Error cargando evento:', err);

        // Mensaje específico para evento no encontrado
        const isNotFound = err.status === 404 || (err.status === 500 && err.error?.details?.includes('no encontrado'));

        this.error = {
          title: isNotFound ? `Evento "${this.slug}" no encontrado` : 'No pudimos cargar el evento',
          message: isNotFound
            ? `El evento no existe o aún no ha sido creado. Verifica que el enlace sea correcto.\n\n💡 Si eres el organizador, consulta SETUP_EVENTO.md para crear el evento primero.`
            : 'Verifica tu conexión o intenta nuevamente más tarde.',
          icon: isNotFound ? '📭' : '🤔'
        };
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openMaps(): void {
    if (this.event?.locationUrl) {
      window.open(this.event.locationUrl, '_blank');
    }
  }

  navigate(path: string): void {
    const navigationExtras = path === 'gifts' ? { state: { fromWelcome: true } } : {};
    this.router.navigate([`/e/${this.slug}/${path}`], navigationExtras);
  }

  onContinue(): void {
    this.router.navigate([`/e/${this.slug}/rsvp`]);
  }
}
