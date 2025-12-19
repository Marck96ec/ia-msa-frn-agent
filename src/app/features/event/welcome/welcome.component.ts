import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService, StateService, ChatService } from '@core/services';
import { Event } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-baby-pink/15 via-white to-baby-blue/15">
      <app-loading-spinner *ngIf="loading" [fullScreen]="true" message="Preparando tu invitación..." />

      <app-error-message *ngIf="error" [error]="error" (retry)="loadEvent()" />

      <div *ngIf="!loading && !error && event" class="flex-1">
        <!-- Hero emocional -->
        <div class="relative h-80 bg-gradient-to-br from-baby-pink to-baby-blue overflow-hidden">
          <img *ngIf="event.imageUrl" [src]="event.imageUrl" [alt]="event.name" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p class="text-4xl mb-2">👶💙</p>
            <h1 class="text-2xl font-bold leading-tight">Bienvenido al Baby Shower de</h1>
            <p class="text-3xl font-bold text-baby-yellow">{{ event.babyName || 'nuestro bebé' }}</p>
          </div>
        </div>

        <div class="px-5 pt-8 pb-10">
          <div class="max-w-lg mx-auto space-y-5">
            <!-- Mensaje emocional principal (dinámico desde IA) -->
            <div class="card text-center space-y-3 shadow-xl min-h-[100px]">
              <!-- Loading del mensaje -->
              <div *ngIf="loadingWelcomeMessage" class="flex items-center justify-center gap-2 py-2">
                <span class="animate-pulse text-2xl">💭</span>
                <span class="text-gray-400 text-sm animate-pulse">Preparando un mensaje especial...</span>
              </div>

              <!-- Error del mensaje (fallback silencioso) -->
              <ng-container *ngIf="!loadingWelcomeMessage && welcomeMessageError">
                <p class="text-xl text-gray-800 leading-relaxed font-medium">
                  La llegada de {{ event.babyName || 'nuestro bebé' }} es un momento mágico que queremos celebrar
                  contigo. 👶💕
                </p>
              </ng-container>

              <!-- Mensaje dinámico de IA -->
              <p
                *ngIf="!loadingWelcomeMessage && !welcomeMessageError && welcomeMessage"
                class="text-xl text-gray-800 leading-relaxed font-medium"
              >
                {{ welcomeMessage }}
              </p>
            </div>

            <!-- CTA Principal - Acción inmediata -->
            <div
              class="card bg-gradient-to-r from-baby-pink/30 via-white to-baby-blue/30 border-2 border-baby-pink/40 text-center space-y-4"
            >
              <div>
                <p class="text-sm text-gray-600 mb-1">Tu siguiente paso</p>
                <h2 class="text-xl font-bold text-gray-900">¿Podrás acompañarnos?</h2>
              </div>
              <button (click)="onContinue()" class="btn-primary w-full text-lg py-4 justify-center shadow-lg">
                Confirmar mi asistencia ✨
              </button>
              <p class="text-xs text-gray-500">Solo toma 30 segundos</p>
            </div>

            <!-- Cuándo y dónde - Info esencial compacta -->
            <div class="card space-y-4">
              <h3 class="text-sm font-bold text-gray-600 uppercase tracking-wide text-center">📍 Cuándo y dónde</h3>

              <div class="space-y-3">
                <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <span class="text-2xl">📅</span>
                  <div>
                    <p class="font-bold text-gray-900">{{ formatDate(event.eventDate) }}</p>
                    <p class="text-sm text-gray-600">{{ formatTime(event.eventDate) }} hrs</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <span class="text-2xl">📍</span>
                  <div class="flex-1">
                    <p class="font-bold text-gray-900">{{ event.location }}</p>
                    <button
                      *ngIf="event.locationUrl"
                      (click)="openMaps()"
                      class="text-sm text-primary-600 font-semibold underline underline-offset-2 mt-1"
                    >
                      Ver en Google Maps →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje personalizado (si existe) -->
            <div *ngIf="event.welcomeMessage" class="card-sm bg-baby-yellow/20 border border-baby-yellow/40">
              <p class="text-gray-700 italic text-center">"{{ event.welcomeMessage }}"</p>
            </div>

            <!-- Acciones secundarias - después de lo principal -->
            <div class="space-y-3 pt-2">
              <p class="text-center text-sm text-gray-500">También puedes explorar</p>
              <div class="grid grid-cols-2 gap-3">
                <button (click)="navigate('gifts')" class="btn-outline flex flex-col items-center gap-1 py-4">
                  <span class="text-2xl">🎁</span>
                  <span class="text-sm font-semibold">Lista de regalos</span>
                </button>
                <button (click)="navigate('baby-message')" class="btn-outline flex flex-col items-center gap-1 py-4">
                  <span class="text-2xl">💌</span>
                  <span class="text-sm font-semibold">Mensaje al bebé</span>
                </button>
              </div>
              <button (click)="navigate('chat')" class="btn-outline w-full flex items-center justify-center gap-2 py-3">
                <span class="text-lg">💬</span>
                <span class="text-sm font-semibold">¿Tienes dudas? Escríbenos</span>
              </button>
            </div>

            <!-- Nota adicional (si existe) -->
            <p *ngIf="event.description" class="text-center text-sm text-gray-500 pt-2">
              {{ event.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WelcomeComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: any = null;

  welcomeMessage = '';
  loadingWelcomeMessage = false;
  welcomeMessageError = false;

  private slug: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private stateService: StateService,
    private chatService: ChatService
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
        this.loadWelcomeMessage(event.babyName);
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

  private loadWelcomeMessage(babyName: string | undefined): void {
    this.loadingWelcomeMessage = true;
    this.welcomeMessageError = false;

    const prompt = `Genera un mensaje de bienvenida corto, emotivo y cercano para una app web del Baby Shower de Thiago.
El mensaje debe mencionar explícitamente a sus padres Amanda y Marco.
Usa máximo 2 oraciones breves, tono familiar y cálido, con 1 emoji sutil.
Debe leerse rápido en pantalla y transmitir gratitud y conexión emocional.
No uses comillas, ni saltos de línea.
Devuelve únicamente el texto final listo para mostrarse en la interfaz.`;

    this.chatService.getSimpleMessage(prompt).subscribe({
      next: message => {
        this.welcomeMessage = message.trim();
        this.loadingWelcomeMessage = false;
      },
      error: err => {
        console.warn('Error cargando mensaje de bienvenida:', err);
        this.loadingWelcomeMessage = false;
        this.welcomeMessageError = true;
      }
    });
  }
}
