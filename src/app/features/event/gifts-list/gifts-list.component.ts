import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GiftService, StateService } from '@core/services';
import { Gift, GiftStatus } from '@core/models';
import { EventHeaderComponent, LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-gifts-list',
  standalone: true,
  imports: [CommonModule, EventHeaderComponent, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-amber-50/80 via-rose-50/50 to-sky-50/60">
      <app-event-header
        [eventName]="eventName"
        subtitle="Regalos"
        [showBack]="!cameFromWelcome"
        [backRoute]="'/e/' + slug + '/support'"
      />

      <div *ngIf="cameFromWelcome" class="max-w-2xl mx-auto px-6 pt-3">
        <button (click)="goToWelcome()" class="btn-outline w-full justify-center">← Volver a la invitación</button>
      </div>

      <div class="max-w-2xl mx-auto px-6 py-6">
        <!-- Context Card: Educación no intrusiva -->
        <div *ngIf="!loading && !error" class="context-card mb-6 animate-fade-in">
          <div class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">💡</span>
            <div class="flex-1 min-w-0">
              <p class="text-gray-700 text-sm leading-relaxed">
                <span class="font-medium">Tip:</span>
                Reserva el regalo para traerlo, apóyanos con el valor o participa en regalos compartidos.
                <span class="text-amber-600 font-medium">Tú eliges cómo acompañarnos 💛</span>
              </p>
              <button
                (click)="openHelpModal()"
                class="text-sm text-amber-600 hover:text-amber-700 font-medium mt-1 transition-smooth underline underline-offset-2"
              >
                Ver cómo funciona →
              </button>
            </div>
          </div>
        </div>

        <!-- Modal de ayuda -->
        <div
          *ngIf="showHelpModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          (click)="closeHelpModal()"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>

          <!-- Modal Content -->
          <div
            class="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
            (click)="$event.stopPropagation()"
          >
            <!-- Close button -->
            <button
              (click)="closeHelpModal()"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-smooth"
              aria-label="Cerrar"
            >
              <span class="text-gray-500">✕</span>
            </button>

            <!-- Header -->
            <div class="text-center mb-6">
              <span class="text-5xl mb-3 block">💛</span>
              <h3 class="text-xl font-bold text-gray-800">¿Cómo funcionan los regalos?</h3>
              <p class="text-gray-600 text-sm mt-2">
                Hemos preparado varias formas sencillas para que puedas apoyar, elige la que más te acomode 💕
              </p>
            </div>

            <!-- Options -->
            <div class="space-y-4 mb-6">
              <!-- Opción 1: Reservar y traer -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <span class="text-2xl flex-shrink-0">🧸</span>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Reservar y traer el regalo</p>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    Puedes reservar un regalo aquí y traerlo el día del Baby Shower.
                  </p>
                </div>
              </div>

              <!-- Opción 2: Apoyar con el valor -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                <span class="text-2xl flex-shrink-0">💳</span>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Apoyar con el valor</p>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    Puedes transferir el valor del regalo y nosotros nos encargamos de comprarlo.
                  </p>
                </div>
              </div>

              <!-- Opción 3: Regalos compartidos -->
              <div class="flex items-start gap-3 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                <span class="text-2xl flex-shrink-0">🤍</span>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">Regalos compartidos</p>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    Algunos regalos pueden ser apoyados entre varias personas. Aporta una parte y juntos completan el
                    regalo.
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer message -->
            <div class="text-center border-t border-gray-100 pt-4">
              <p class="text-gray-500 text-sm leading-relaxed">
                No hay una forma correcta o incorrecta.<br />
                <span class="text-amber-600 font-medium">Gracias por acompañarnos con tanto cariño 💙</span>
              </p>
            </div>

            <!-- CTA -->
            <button
              (click)="closeHelpModal()"
              class="w-full mt-4 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-white font-semibold transition-smooth hover-scale active-press"
            >
              ¡Entendido! Ver regalos
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2" *ngIf="!loading">
          <button
            *ngFor="let filter of filters"
            (click)="activeFilter = filter.value; filterGifts()"
            [class.chip-active]="activeFilter === filter.value"
            class="chip whitespace-nowrap transition-smooth"
          >
            {{ filter.label }}
          </button>
        </div>

        <app-loading-spinner *ngIf="loading" message="Cargando regalos..." />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadGifts()" />

        <div
          *ngIf="!loading && !error && activeFilter === 'PARTIALLY_FUNDED' && filteredGifts.length > 0"
          class="context-card border-rose-100 bg-rose-50/50 mb-4 animate-fade-in"
        >
          <div class="flex items-start gap-3">
            <span class="text-2xl">💞</span>
            <div>
              <p class="font-semibold text-gray-800 text-sm mb-1">Regalos compartidos</p>
              <p class="text-gray-600 text-sm leading-relaxed">
                Puedes aportar cualquier monto o reservar el regalo completo para traerlo.
              </p>
            </div>
          </div>
        </div>

        <!-- Gifts Grid -->
        <div *ngIf="!loading && !error" class="space-y-4">
          <div
            *ngFor="let gift of filteredGifts; let i = index"
            (click)="openGiftDetail(gift.id)"
            class="gift-card group"
            [style.animation-delay.ms]="i * 50"
          >
            <div class="flex gap-4">
              <!-- Image -->
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  *ngIf="gift.imageUrl"
                  [src]="gift.imageUrl"
                  [alt]="gift.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <div *ngIf="!gift.imageUrl" class="w-full h-full flex items-center justify-center text-3xl">🎁</div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-800 mb-1 truncate">{{ gift.name }}</h3>
                <p *ngIf="gift.description" class="text-sm text-gray-600 mb-2 line-clamp-2">
                  {{ gift.description }}
                </p>
                <div *ngIf="gift.purchaseUrl" class="mt-1">
                  <a
                    class="text-amber-600 text-sm font-semibold underline underline-offset-2 hover:text-amber-700 transition-smooth"
                    [href]="gift.purchaseUrl"
                    target="_blank"
                    rel="noopener"
                    (click)="$event.stopPropagation()"
                  >
                    Ver enlace de compra ↗
                  </a>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-semibold text-amber-600">\${{ gift.price }}</span>
                  <span [class]="getBadgeClass(gift.status)" class="badge">
                    {{ getStatusLabel(gift.status) }}
                  </span>
                </div>

                <!-- Progress Bar (si es compartido) -->
                <div *ngIf="gift.allowSplit && gift.status !== GiftStatus.FULLY_FUNDED" class="mt-2">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="gift.fundingPercentage"></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Recaudado: \${{ gift.currentFunding }} de \${{ gift.price }}</p>
                </div>
              </div>

              <div
                class="text-gray-400 self-center w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-600 transition-smooth"
              >
                →
              </div>
            </div>
          </div>

          <p *ngIf="filteredGifts.length === 0" class="text-center text-gray-500 py-8">
            No hay regalos en esta categoría
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.2s ease-out forwards;
      }
      .animate-scale-in {
        animation: scaleIn 0.2s ease-out forwards;
      }
      .transition-smooth {
        transition: all 0.2s ease-out;
      }
      .hover-scale:hover {
        transform: scale(1.02);
      }
      .active-press:active {
        transform: scale(0.98);
      }
      .context-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(251, 191, 36, 0.2);
        border-radius: 1rem;
        padding: 1rem;
      }
      .gift-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 1rem;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s ease-out;
        animation: fadeIn 0.2s ease-out forwards;
        opacity: 0;
      }
      .gift-card:hover {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }
    `
  ]
})
export class GiftsListComponent implements OnInit {
  GiftStatus = GiftStatus; // Disponible en template
  slug = '';
  eventName = 'Baby Shower';
  gifts: Gift[] = [];
  filteredGifts: Gift[] = [];
  loading = true;
  error: any = null;
  activeFilter = 'all';
  cameFromWelcome = false;
  showHelpModal = false;

  private readonly HELP_SEEN_KEY = 'gifts_help_seen';

  filters = [
    { label: 'Todos', value: 'all' },
    { label: 'Disponibles', value: 'AVAILABLE' },
    { label: 'Compartidos', value: 'PARTIALLY_FUNDED' },
    { label: 'Completados', value: 'FULLY_FUNDED' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private giftService: GiftService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const navigationState = this.router.getCurrentNavigation()?.extras?.state as { fromWelcome?: boolean } | undefined;
    const cameFromState = navigationState?.fromWelcome === true || history.state?.fromWelcome === true;
    const cameFromQuery = this.route.snapshot.queryParamMap.get('from') === 'welcome';
    this.cameFromWelcome = cameFromState || cameFromQuery;
    const event = this.stateService.getCurrentEvent();
    if (event) {
      this.eventName = `Regalos para ${event.babyName}`;
    }
    this.loadGifts();
    this.checkFirstVisit();
  }

  private checkFirstVisit(): void {
    const helpSeen = localStorage.getItem(this.HELP_SEEN_KEY);
    if (!helpSeen) {
      // Mostrar modal después de un breve delay para mejor UX
      setTimeout(() => {
        this.showHelpModal = true;
      }, 500);
    }
  }

  openHelpModal(): void {
    this.showHelpModal = true;
  }

  closeHelpModal(): void {
    this.showHelpModal = false;
    localStorage.setItem(this.HELP_SEEN_KEY, 'true');
  }

  loadGifts(): void {
    this.loading = true;
    this.error = null;

    this.giftService.getEventGifts(this.slug).subscribe({
      next: gifts => {
        this.gifts = gifts;
        this.filterGifts();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = {
          title: 'No pudimos cargar los regalos',
          message: 'Por favor, intenta nuevamente.',
          icon: '📦'
        };
      }
    });
  }

  filterGifts(): void {
    switch (this.activeFilter) {
      case 'all':
        this.filteredGifts = this.gifts;
        break;
      case 'PARTIALLY_FUNDED':
        this.filteredGifts = this.gifts.filter(g => g.status === GiftStatus.PARTIALLY_FUNDED || g.allowSplit === true);
        break;
      case 'FULLY_FUNDED':
        this.filteredGifts = this.gifts.filter(
          g => g.status === GiftStatus.FULLY_FUNDED || g.status === GiftStatus.RESERVED
        );
        break;
      default:
        this.filteredGifts = this.gifts.filter(g => g.status === this.activeFilter);
        break;
    }
  }

  getStatusLabel(status: GiftStatus): string {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Reservado',
      PARTIALLY_FUNDED: 'En progreso',
      FULLY_FUNDED: 'Completado',
      INACTIVE: 'Inactivo'
    };
    return labels[status] || status;
  }

  getBadgeClass(status: GiftStatus): string {
    const classes: Record<string, string> = {
      AVAILABLE: 'badge-success',
      RESERVED: 'badge-warning',
      PARTIALLY_FUNDED: 'badge-info',
      FULLY_FUNDED: 'badge-danger',
      INACTIVE: 'badge-muted'
    };
    return `badge ${classes[status] || ''}`;
  }

  openGiftDetail(giftId: string): void {
    this.router.navigate([`/e/${this.slug}/gifts/${giftId}`]);
  }

  goToWelcome(): void {
    this.router.navigate([`/e/${this.slug}/welcome`]);
  }
}
