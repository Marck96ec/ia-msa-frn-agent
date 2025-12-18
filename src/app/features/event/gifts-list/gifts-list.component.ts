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
    <div class="min-h-screen bg-gradient-to-br from-baby-pink/10 to-baby-blue/10">
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
        <!-- Filters -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2" *ngIf="!loading">
          <button
            *ngFor="let filter of filters"
            (click)="activeFilter = filter.value; filterGifts()"
            [class.chip-active]="activeFilter === filter.value"
            class="chip whitespace-nowrap"
          >
            {{ filter.label }}
          </button>
        </div>

        <app-loading-spinner *ngIf="loading" message="Cargando regalos..." />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadGifts()" />

        <div
          *ngIf="!loading && !error && activeFilter === 'PARTIALLY_FUNDED' && filteredGifts.length > 0"
          class="card bg-white/80 border border-primary-100 text-sm text-gray-700 mb-4"
        >
          <p class="font-semibold text-gray-800 mb-1">💞 Regalos compartidos</p>
          <p class="leading-relaxed">
            En estos regalos puedes elegir una de estas opciones:<br />
            • Aportar cualquier monto para completarlo entre varias personas.<br />
            • Reservar el regalo completo y traerlo el día del baby shower.
          </p>
        </div>

        <!-- Gifts Grid -->
        <div *ngIf="!loading && !error" class="space-y-4">
          <div
            *ngFor="let gift of filteredGifts"
            (click)="openGiftDetail(gift.id)"
            class="card cursor-pointer hover:shadow-xl transition-all group"
          >
            <div class="flex gap-4">
              <!-- Image -->
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  *ngIf="gift.imageUrl"
                  [src]="gift.imageUrl"
                  [alt]="gift.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform"
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
                    class="text-primary-600 text-sm font-semibold underline underline-offset-2"
                    [href]="gift.purchaseUrl"
                    target="_blank"
                    rel="noopener"
                    (click)="$event.stopPropagation()"
                  >
                    Ver enlace de compra ↗
                  </a>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-semibold text-primary-600">\${{ gift.price }}</span>
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

              <div class="text-gray-400 self-center">→</div>
            </div>
          </div>

          <p *ngIf="filteredGifts.length === 0" class="text-center text-gray-500 py-8">
            No hay regalos en esta categoría
          </p>
        </div>
      </div>
    </div>
  `
})
export class GiftsListComponent implements OnInit {
  GiftStatus = GiftStatus; // Disponible en template
  slug: string = '';
  eventName: string = 'Baby Shower';
  gifts: Gift[] = [];
  filteredGifts: Gift[] = [];
  loading = true;
  error: any = null;
  activeFilter: string = 'all';
  cameFromWelcome = false;

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
        this.filteredGifts = this.gifts.filter(
          g => g.status === GiftStatus.PARTIALLY_FUNDED || g.allowSplit === true
        );
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
