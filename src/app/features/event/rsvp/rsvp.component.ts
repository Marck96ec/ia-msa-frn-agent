import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RsvpService, AuthService, StateService, EventService } from '@core/services';
import { RSVPStatus, CreateRSVPRequest } from '@core/models';
import {
  EventHeaderComponent,
  LoadingSpinnerComponent,
  SuccessMessageComponent,
  ErrorMessageComponent
} from '@shared/components';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EventHeaderComponent,
    LoadingSpinnerComponent,
    SuccessMessageComponent,
    ErrorMessageComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-baby-pink/10 to-baby-blue/10">
      <app-event-header
        [eventName]="eventName"
        subtitle="Confirmación de asistencia"
        [showBack]="true"
        [backRoute]="'/e/' + slug + '/welcome'"
      />

      <div class="max-w-2xl mx-auto px-6 py-8 pb-32">
        <!-- Pregunta Principal -->
        <div *ngIf="!submitted && !loading" class="space-y-6 animate-slide-up">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">💌</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-3 text-balance">
              ¿Podrás acompañarnos en este día tan especial?
            </h2>
            <p class="text-gray-600 text-lg">
              {{ eventDate }}
            </p>
          </div>

          <!-- Opciones RSVP -->
          <div class="space-y-4">
            <button
              (click)="selectStatus(RSVPStatus.CONFIRMED)"
              [class.ring-4]="selectedStatus === RSVPStatus.CONFIRMED"
              [class.ring-primary-200]="selectedStatus === RSVPStatus.CONFIRMED"
              class="w-full bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all text-left border-2"
              [class.border-primary-400]="selectedStatus === RSVPStatus.CONFIRMED"
              [class.border-transparent]="selectedStatus !== RSVPStatus.CONFIRMED"
            >
              <div class="flex items-center gap-4">
                <div class="text-4xl">🎉</div>
                <div class="flex-1">
                  <div class="text-xl font-bold text-gray-800">¡Ahí estaré!</div>
                  <div class="text-gray-600">No me lo perdería por nada</div>
                </div>
                <div *ngIf="selectedStatus === RSVPStatus.CONFIRMED" class="text-primary-500 text-2xl">✓</div>
              </div>
            </button>

            <button
              (click)="selectStatus(RSVPStatus.DECLINED)"
              [class.ring-4]="selectedStatus === RSVPStatus.DECLINED"
              [class.ring-gray-200]="selectedStatus === RSVPStatus.DECLINED"
              class="w-full bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all text-left border-2"
              [class.border-gray-400]="selectedStatus === RSVPStatus.DECLINED"
              [class.border-transparent]="selectedStatus !== RSVPStatus.DECLINED"
            >
              <div class="flex items-center gap-4">
                <div class="text-4xl">💙</div>
                <div class="flex-1">
                  <div class="text-xl font-bold text-gray-800">Me encantaría, pero no puedo</div>
                  <div class="text-gray-600">Los acompaño de corazón</div>
                </div>
                <div *ngIf="selectedStatus === RSVPStatus.DECLINED" class="text-gray-500 text-2xl">✓</div>
              </div>
            </button>
          </div>

          <!-- Formulario adicional -->
          <div *ngIf="selectedStatus" class="card space-y-4 animate-slide-up">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                ¿Cómo te llamas? <span class="text-red-500">*</span>
              </label>
              <input type="text" [(ngModel)]="userName" placeholder="Tu nombre completo" class="input-field" required />
            </div>

            <div *ngIf="selectedStatus === RSVPStatus.CONFIRMED">
              <label class="block text-sm font-semibold text-gray-700 mb-2"> ¿Vienen más personas contigo? </label>
              <div class="flex items-center gap-4">
                <button
                  (click)="changeGuests(-1)"
                  [disabled]="additionalGuests === 0"
                  class="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-2xl"
                >
                  −
                </button>
                <div class="flex-1 text-center">
                  <div class="text-3xl font-bold text-gray-800">{{ additionalGuests }}</div>
                  <div class="text-sm text-gray-500">
                    {{
                      additionalGuests === 0
                        ? 'Solo yo'
                        : additionalGuests === 1
                        ? '1 persona más'
                        : additionalGuests + ' personas más'
                    }}
                  </div>
                </div>
                <button (click)="changeGuests(1)" class="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl">
                  +
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                ¿Quieres dejarnos algún mensaje? (opcional)
              </label>
              <textarea
                [(ngModel)]="message"
                placeholder="Un mensaje cariñoso..."
                rows="3"
                class="input-field resize-none"
              ></textarea>
            </div>

            <button
              (click)="confirm()"
              [disabled]="!userName.trim()"
              class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ selectedStatus === RSVPStatus.CONFIRMED ? '¡Confirmar mi asistencia!' : 'Enviar respuesta' }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <app-loading-spinner *ngIf="loading" message="Guardando tu respuesta..." />

        <!-- Success -->
        <div *ngIf="submitted && !loading" class="space-y-6 animate-slide-up">
          <app-success-message
            [title]="selectedStatus === RSVPStatus.CONFIRMED ? '¡Genial! Te esperamos' : 'Gracias por avisarnos'"
            [message]="
              selectedStatus === RSVPStatus.CONFIRMED
                ? 'Nos hace muy felices que nos acompañes ese día 💕'
                : 'Aunque no puedas venir, agradecemos tu cariño 💙'
            "
            [icon]="selectedStatus === RSVPStatus.CONFIRMED ? '🎉' : '💙'"
          />

          <!-- Agregar al calendario (solo si confirmó) -->
          <div *ngIf="selectedStatus === RSVPStatus.CONFIRMED" class="card">
            <h3 class="text-lg font-bold text-gray-800 mb-3 text-center">📅 No olvides la fecha</h3>
            <p class="text-gray-600 text-sm text-center mb-4">
              Agrega el evento a tu calendario para que no se te pase
            </p>

            <!-- Botón único inteligente según dispositivo -->
            <a
              *ngIf="!isAppleDevice"
              [href]="getGoogleCalendarUrl()"
              target="_blank"
              class="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <span class="text-2xl">📅</span>
              <span>Agregar a mi calendario</span>
            </a>

            <a
              *ngIf="isAppleDevice"
              [href]="getIcsDownloadUrl()"
              download="baby-shower.ics"
              class="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <span class="text-2xl">📅</span>
              <span>Agregar a mi calendario</span>
            </a>
          </div>

          <div class="space-y-3">
            <button (click)="goToSupport()" class="btn-primary w-full">Continuar</button>
            <button (click)="goToWelcome()" class="btn-outline w-full">Volver al inicio</button>
          </div>
        </div>

        <!-- Error -->
        <app-error-message *ngIf="error" [error]="error" (retry)="confirm()" />
      </div>
    </div>
  `
})
export class RsvpComponent implements OnInit {
  RSVPStatus = RSVPStatus; // Hacer enum disponible en template
  slug: string = '';
  eventName: string = 'Baby Shower';
  eventDate: string = '';
  selectedStatus: RSVPStatus | null = null;
  userName: string = '';
  message: string = '';
  additionalGuests: number = 0;
  loading = false;
  submitted = false;
  error: any = null;
  isAppleDevice = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rsvpService: RsvpService,
    private authService: AuthService,
    private stateService: StateService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.detectDevice();

    const event = this.stateService.getCurrentEvent();
    if (event) {
      this.setEventDetails(event);
    } else {
      this.loadEvent();
    }

    // Pre-cargar nombre si ya existe
    const savedName = this.authService.getUserName();
    if (savedName) {
      this.userName = savedName;
    }
  }

  private detectDevice(): void {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    this.isAppleDevice = /iPad|iPhone|iPod|Macintosh/i.test(userAgent) && !(window as any).MSStream;
  }

  selectStatus(status: RSVPStatus): void {
    this.selectedStatus = status;
    if (status === RSVPStatus.DECLINED) {
      this.additionalGuests = 0;
    }
  }

  changeGuests(delta: number): void {
    const newValue = this.additionalGuests + delta;
    if (newValue >= 0 && newValue <= 10) {
      this.additionalGuests = newValue;
    }
  }

  private loadEvent(): void {
    if (!this.slug) return;
    this.eventService.getEventBySlug(this.slug).subscribe({
      next: event => {
        this.stateService.setCurrentEvent(event);
        this.setEventDetails(event);
      },
      error: () => {
        this.error = {
          title: 'No pudimos cargar el evento',
          message: 'Revisa el enlace o intenta nuevamente.',
          icon: '🤔'
        };
      }
    });
  }

  private setEventDetails(event: any): void {
    this.eventName = event.name;
    this.eventDate = new Date(event.eventDate).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  confirm(): void {
    if (!this.userName.trim() || !this.selectedStatus) return;

    const event = this.stateService.getCurrentEvent();
    if (!event) return;

    this.loading = true;
    this.error = null;

    const request: CreateRSVPRequest = {
      userId: this.authService.getUserId(),
      guestName: this.userName.trim(),
      status: this.selectedStatus,
      guestsCount: this.selectedStatus === RSVPStatus.CONFIRMED ? 1 + this.additionalGuests : undefined,
      notes: this.message.trim() || undefined
    };

    // Guardar nombre para siguiente vez
    this.authService.setUserName(this.userName.trim());

    this.rsvpService.createRSVP(event.slug, request).subscribe({
      next: response => {
        this.loading = false;
        this.submitted = true;
        if (response.token) {
          this.stateService.addCommitment(response.token);
        }
      },
      error: err => {
        this.loading = false;
        this.error = {
          title: 'No pudimos guardar tu respuesta',
          message: 'Por favor, intenta nuevamente en un momento.',
          icon: '😔'
        };
      }
    });
  }

  goToSupport(): void {
    this.router.navigate([`/e/${this.slug}/support`]);
  }

  goToWelcome(): void {
    this.router.navigate([`/e/${this.slug}/welcome`]);
  }

  getGoogleCalendarUrl(): string {
    const event = this.stateService.getCurrentEvent();
    if (!event) return '#';

    const startDate = new Date(event.eventDate);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // +3 horas

    const formatDate = (date: Date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.name || 'Baby Shower',
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: event.description || '¡Te esperamos con mucho cariño!',
      location: event.location || '',
      sf: 'true'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  getIcsDownloadUrl(): string {
    const event = this.stateService.getCurrentEvent();
    if (!event) return '#';

    const startDate = new Date(event.eventDate);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // +3 horas

    const formatDate = (date: Date) => {
      return (
        date
          .toISOString()
          .replace(/[-:]/g, '')
          .replace(/\.\d{3}/, '')
          .slice(0, -1) + 'Z'
      );
    };

    const escapeIcs = (text: string) => {
      return (text || '').replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Baby Shower App//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${escapeIcs(event.name || 'Baby Shower')}`,
      `DESCRIPTION:${escapeIcs(event.description || '¡Te esperamos con mucho cariño!')}`,
      `LOCATION:${escapeIcs(event.location || '')}`,
      `URL:${event.locationUrl || ''}`,
      'STATUS:CONFIRMED',
      `UID:${event.id}-${Date.now()}@babyshower.app`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  }
}
