import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
        <!-- Hero emocional con animaciones flotantes -->
        <div class="relative h-80 bg-gradient-to-br from-baby-pink to-baby-blue overflow-hidden">
          <img *ngIf="event.imageUrl" [src]="event.imageUrl" [alt]="event.name" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          <!-- Emojis flotantes decorativos -->
          <div class="floating-emojis">
            <span class="floating-emoji" style="--delay: 0s; --duration: 8s; --start-x: 10%;">✨</span>
            <span class="floating-emoji" style="--delay: 1.5s; --duration: 10s; --start-x: 25%;">💙</span>
            <span class="floating-emoji" style="--delay: 3s; --duration: 7s; --start-x: 45%;">⭐</span>
            <span class="floating-emoji" style="--delay: 0.5s; --duration: 9s; --start-x: 65%;">💫</span>
            <span class="floating-emoji" style="--delay: 2s; --duration: 11s; --start-x: 80%;">🤍</span>
            <span class="floating-emoji" style="--delay: 4s; --duration: 8s; --start-x: 90%;">✨</span>
            <span class="floating-emoji" style="--delay: 2.5s; --duration: 12s; --start-x: 5%;">💛</span>
            <span class="floating-emoji" style="--delay: 1s; --duration: 9s; --start-x: 55%;">🌟</span>
          </div>

          <!-- Contenido del hero -->
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <p class="text-4xl mb-2">👶💙</p>
            <h1 class="text-2xl font-bold leading-tight">Bienvenido al Baby Shower de</h1>
            <p class="text-3xl font-bold text-baby-yellow">{{ event.babyName || 'nuestro bebé' }}</p>
          </div>

          <!-- Botón de música ambiental -->
          <button
            (click)="toggleMusic()"
            class="music-toggle"
            [class.playing]="isMusicPlaying"
            aria-label="Reproducir música ambiental"
          >
            <span class="music-icon" [class.animate-pulse-music]="isMusicPlaying">
              {{ isMusicPlaying ? '🎵' : '🔇' }}
            </span>
            <span class="music-label">{{ isMusicPlaying ? 'Música' : 'Activar' }}</span>
          </button>

          <!-- Audio element (hidden) -->
          <audio #audioPlayer loop preload="none">
            <source src="https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3" type="audio/mpeg" />
          </audio>
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

            <!-- Curiosidad del día -->
            <div class="curiosity-card">
              <div class="flex items-start gap-3">
                <div class="curiosity-icon">
                  <span class="text-2xl">🧒</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <p class="text-xs font-bold text-amber-700 uppercase tracking-wide">¿Sabías que...?</p>
                    <button
                      *ngIf="!loadingCuriosity"
                      (click)="loadNewCuriosity()"
                      class="text-xs text-amber-600 hover:text-amber-700 font-medium transition-smooth"
                      aria-label="Cargar nueva curiosidad"
                    >
                      🔄 Otra
                    </button>
                  </div>

                  <!-- Loading -->
                  <div *ngIf="loadingCuriosity" class="flex items-center gap-2">
                    <span class="animate-bounce text-lg">💭</span>
                    <span class="text-gray-400 text-sm animate-pulse">Buscando un dato curioso...</span>
                  </div>

                  <!-- Curiosidad -->
                  <p *ngIf="!loadingCuriosity && curiosityFact" class="text-gray-700 text-sm leading-relaxed">
                    {{ curiosityFact }}
                  </p>

                  <!-- Fallback si hay error -->
                  <p
                    *ngIf="!loadingCuriosity && !curiosityFact && curiosityError"
                    class="text-gray-600 text-sm leading-relaxed"
                  >
                    Los bebés pueden reconocer la voz de su mamá desde el vientre. ¡El amor empieza antes de nacer! 👶💕
                  </p>
                </div>
              </div>
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
  `,
  styles: [
    `
      /* Contenedor de emojis flotantes */
      .floating-emojis {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 5;
      }

      /* Emoji flotante individual */
      .floating-emoji {
        position: absolute;
        bottom: -40px;
        left: var(--start-x, 50%);
        font-size: 1.5rem;
        opacity: 0;
        animation: floatUp var(--duration, 8s) ease-in-out var(--delay, 0s) infinite;
      }

      @keyframes floatUp {
        0% {
          opacity: 0;
          transform: translateY(0) scale(0.5) rotate(0deg);
        }
        10% {
          opacity: 0.7;
        }
        50% {
          opacity: 0.5;
        }
        90% {
          opacity: 0.3;
        }
        100% {
          opacity: 0;
          transform: translateY(-350px) scale(1) rotate(20deg);
        }
      }

      /* Botón de música */
      .music-toggle {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 20;
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 0.75rem;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        border: none;
        border-radius: 9999px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.2s ease-out;
      }

      .music-toggle:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.05);
      }

      .music-toggle:active {
        transform: scale(0.95);
      }

      .music-toggle.playing {
        background: linear-gradient(135deg, rgba(251, 191, 36, 0.9), rgba(244, 114, 182, 0.9));
      }

      .music-toggle.playing .music-label {
        color: white;
      }

      .music-icon {
        font-size: 1.125rem;
        line-height: 1;
      }

      .music-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #374151;
      }

      .animate-pulse-music {
        animation: pulseMusic 1.5s ease-in-out infinite;
      }

      @keyframes pulseMusic {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
      }

      /* Curiosity card */
      .curiosity-card {
        background: linear-gradient(135deg, rgba(254, 243, 199, 0.8), rgba(254, 215, 170, 0.6));
        backdrop-filter: blur(8px);
        border: 1px solid rgba(251, 191, 36, 0.3);
        border-radius: 1rem;
        padding: 1rem;
        transition: all 0.2s ease-out;
      }

      .curiosity-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
      }

      .curiosity-icon {
        flex-shrink: 0;
        width: 2.5rem;
        height: 2.5rem;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .transition-smooth {
        transition: all 0.2s ease-out;
      }
    `
  ]
})
export class WelcomeComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  event: Event | null = null;
  loading = true;
  error: any = null;

  welcomeMessage = '';
  loadingWelcomeMessage = false;
  welcomeMessageError = false;

  curiosityFact = '';
  loadingCuriosity = false;
  curiosityError = false;

  isMusicPlaying = false;

  private slug = '';

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
        this.loadCuriosity();
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

  toggleMusic(): void {
    const audio = this.audioPlayerRef?.nativeElement;
    if (!audio) return;

    if (this.isMusicPlaying) {
      audio.pause();
      this.isMusicPlaying = false;
    } else {
      audio.volume = 0.3; // Volumen suave
      audio
        .play()
        .then(() => {
          this.isMusicPlaying = true;
        })
        .catch(err => {
          console.warn('No se pudo reproducir audio:', err);
        });
    }
  }

  ngOnDestroy(): void {
    // Detener música al salir del componente
    const audio = this.audioPlayerRef?.nativeElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
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

  private loadCuriosity(): void {
    this.loadingCuriosity = true;
    this.curiosityError = false;

    // Categorías aleatorias para variar las curiosidades
    const categories = [
      'el desarrollo del cerebro de un bebé',
      'los sentidos de un recién nacido',
      'el embarazo y gestación',
      'los primeros días de vida',
      'la conexión entre mamá y bebé',
      'el sueño de los bebés',
      'los reflejos innatos de los bebés',
      'la alimentación del recién nacido',
      'las emociones de los bebés',
      'el crecimiento en el primer año',
      'la comunicación de los bebés',
      'los hitos del desarrollo infantil'
    ];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomId = Math.random().toString(36).substring(7);

    const prompt = `[ID:${randomId}] Genera UN dato curioso, sorprendente y poco conocido sobre ${randomCategory}.
Debe ser un hecho científico real y fascinante que la mayoría de personas no conoce.
Usa máximo 2 oraciones breves y un tono cálido y asombroso.
Incluye 1 emoji al final que sea relevante al dato.
No uses comillas ni saltos de línea.
Empieza directamente con el dato, sin "¿Sabías que...?".
Devuelve únicamente el texto final, diferente a cualquier respuesta anterior.`;

    this.chatService.getSimpleMessage(prompt).subscribe({
      next: fact => {
        this.curiosityFact = fact.trim();
        this.loadingCuriosity = false;
      },
      error: err => {
        console.warn('Error cargando curiosidad:', err);
        this.loadingCuriosity = false;
        this.curiosityError = true;
      }
    });
  }

  loadNewCuriosity(): void {
    this.loadCuriosity();
  }
}
