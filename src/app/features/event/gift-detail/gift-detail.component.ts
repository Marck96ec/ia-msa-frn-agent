import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GiftService, AuthService, StateService } from '@core/services';
import { Gift, GiftStatus, ReserveGiftRequest, ContributeGiftRequest } from '@core/models';
import {
  EventHeaderComponent,
  LoadingSpinnerComponent,
  ErrorMessageComponent,
  SuccessMessageComponent
} from '@shared/components';

@Component({
  selector: 'app-gift-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EventHeaderComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SuccessMessageComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-baby-pink/10 to-baby-blue/10">
      <app-event-header [eventName]="'Detalle del regalo'" [showBack]="true" [backRoute]="'/e/' + slug + '/gifts'" />

      <div class="max-w-2xl mx-auto px-6 py-6 pb-32">
        <app-loading-spinner *ngIf="loading" message="Cargando..." />

        <app-error-message *ngIf="error" [error]="error" (retry)="loadGift()" />

        <!-- Gift Detail -->
        <div *ngIf="!loading && !error && gift && !submitted" class="space-y-6 animate-slide-up">
          <!-- Image -->
          <div class="w-full h-64 rounded-3xl overflow-hidden bg-gray-100">
            <img *ngIf="gift.imageUrl" [src]="gift.imageUrl" [alt]="gift.name" class="w-full h-full object-cover" />
            <div *ngIf="!gift.imageUrl" class="w-full h-full flex items-center justify-center text-8xl">🎁</div>
          </div>

          <!-- Info -->
          <div class="card">
            <h1 class="text-2xl font-bold text-gray-800 mb-3">{{ gift.name }}</h1>
            <p *ngIf="gift.description" class="text-gray-600 mb-4">{{ gift.description }}</p>
            <div *ngIf="gift.purchaseUrl" class="mb-4">
              <a class="btn-outline w-full justify-center" [href]="gift.purchaseUrl" target="_blank" rel="noopener">
                Ver enlace de compra ↗
              </a>
            </div>
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl font-bold text-primary-600">\${{ gift.price }}</span>
              <span [class]="getBadgeClass(gift.status)" class="badge">
                {{ getStatusLabel(gift.status) }}
              </span>
            </div>

            <!-- Progress (si es compartido) -->
            <div *ngIf="gift.allowSplit && gift.status !== GiftStatus.FULLY_FUNDED">
              <div class="progress-bar mb-2">
                <div class="progress-fill" [style.width.%]="gift.fundingPercentage"></div>
              </div>
              <p class="text-sm text-gray-600">
                Recaudado: \${{ gift.currentFunding }} de \${{ gift.price }}
                <span class="font-semibold text-primary-600">
                  ({{ gift.fundingPercentage.toFixed(0) }}% completado)
                </span>
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="space-y-4"
            *ngIf="gift.status === GiftStatus.AVAILABLE || gift.status === GiftStatus.PARTIALLY_FUNDED"
          >
            <!-- Reservar completo -->
            <div
              *ngIf="gift.status === GiftStatus.AVAILABLE"
              class="card bg-gradient-to-br from-baby-pink/20 to-primary-100/30"
            >
              <div class="space-y-4 text-center">
                <div class="text-4xl">🎁</div>
                <h3 class="text-xl font-bold text-gray-800">¿Quieres regalarlo?</h3>
                <p class="text-gray-600">
                  Puedes hacerte cargo del regalo completo y nosotros nos encargamos de conseguirlo con todo el
                  cariño. Resérvalo aquí y cuéntanos cómo prefieres apoyarnos.
                </p>

                <div class="text-left bg-white/80 rounded-2xl p-4 shadow-inner space-y-2">
                  <p class="text-sm font-semibold text-gray-800">Opciones para apoyar:</p>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>🎁 Traer el regalo el día del baby shower</li>
                    <li>💌 Aportar el valor para que nosotros lo compremos por ti</li>
                  </ul>
                </div>

                <div class="text-left bg-white/60 rounded-2xl p-4 text-sm text-gray-700 space-y-1">
                  <p class="font-semibold text-gray-800">💳 Si deseas aportar el valor:</p>
                  <p>Banco: Banco Pichincha</p>
                  <p>Cuenta: Ahorro transaccional</p>
                  <p>Número: 2203444745</p>
                  <p>Titular: Marco Clavijo</p>
                  <p class="text-xs text-gray-500">
                    Cuando realices el aporte, confírmalo en la app para marcar el regalito como reservado.
                  </p>
                </div>

                <input type="text" [(ngModel)]="userName" placeholder="Tu nombre" class="input-field" />
                <button
                  (click)="reserveComplete()"
                  [disabled]="!userName.trim() || reserving"
                  class="btn-primary w-full disabled:opacity-50"
                >
                  {{ reserving ? 'Procesando...' : 'Resérvalo aquí 😊' }}
                </button>
              </div>
            </div>

            <!-- Aportar -->
            <div *ngIf="gift.allowSplit" class="card">
              <div class="text-center mb-4">
                <div class="text-4xl mb-3">💝</div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Aportar con cariño</h3>
                <p class="text-gray-600">También puedes contribuir con la cantidad que prefieras</p>
              </div>

              <div class="space-y-3">
                <input
                  *ngIf="!userName.trim()"
                  type="text"
                  [(ngModel)]="userName"
                  placeholder="Tu nombre"
                  class="input-field"
                />

                <!-- Quick amounts -->
                <div class="grid grid-cols-4 gap-2">
                  <button
                    *ngFor="let amount of quickAmounts"
                    (click)="selectAmount(amount)"
                    [class.chip-active]="contributionAmount === amount"
                    class="chip justify-center"
                  >
                    \${{ amount }}
                  </button>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2"> O ingresa otro monto </label>
                  <input
                    type="number"
                    [(ngModel)]="contributionAmount"
                    [max]="gift.price - gift.currentFunding"
                    placeholder="0"
                    class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2"> Mensaje (opcional) </label>
                  <textarea
                    [(ngModel)]="contributionMessage"
                    placeholder="Un mensaje bonito..."
                    rows="2"
                    class="input-field resize-none"
                  ></textarea>
                </div>

                <button
                  (click)="contribute()"
                  [disabled]="!userName.trim() || !contributionAmount || contributionAmount <= 0 || contributing"
                  class="btn-primary w-full disabled:opacity-50"
                >
                  {{ contributing ? 'Procesando...' : 'Aportar $' + (contributionAmount || 0) }}
                </button>
              </div>
            </div>
          </div>

          <!-- Already completed -->
          <div *ngIf="gift.status === GiftStatus.FULLY_FUNDED" class="card text-center">
            <div class="text-6xl mb-3">✨</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Este regalo ya está completo</h3>
            <p class="text-gray-600">¡Gracias a todos los que colaboraron!</p>
            <button (click)="goBackToList()" class="btn-outline w-full mt-4">Ver otros regalos</button>
          </div>
        </div>

        <!-- Success -->
        <div *ngIf="submitted" class="space-y-6 animate-slide-up">
          <app-success-message [title]="'¡Muchas gracias!'" [message]="successMessage" [icon]="'💖'" />

          <div class="space-y-3">
            <button (click)="navigate('baby-message')" class="btn-primary w-full">Dejar mensaje para el bebé</button>
            <button (click)="navigate('gifts')" class="btn-outline w-full">Ver más regalos</button>
            <button (click)="navigate('thanks')" class="btn-outline w-full">Finalizar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GiftDetailComponent implements OnInit {
  GiftStatus = GiftStatus; // Hacer enum disponible en template
  slug: string = '';
  giftId: string = '';
  gift: Gift | null = null;
  loading = true;
  error: any = null;
  submitted = false;
  successMessage = '';

  userName: string = '';
  contributionAmount: number | null = null;
  contributionMessage: string = '';
  reserving = false;
  contributing = false;

  quickAmounts = [5, 10, 20, 50];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private giftService: GiftService,
    private authService: AuthService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.giftId = this.route.snapshot.paramMap.get('giftId') || '';

    // Pre-cargar nombre
    const savedName = this.authService.getUserName();
    if (savedName) {
      this.userName = savedName;
    }

    this.loadGift();
  }

  loadGift(): void {
    this.loading = true;
    this.error = null;

    this.giftService.getGiftById(this.giftId).subscribe({
      next: gift => {
        this.gift = gift;
        this.loading = false;

        // Sugerir montos rápidos basados en lo que falta
        if (gift.allowSplit && gift.currentFunding < gift.price) {
          const remaining = gift.price - gift.currentFunding;
          this.quickAmounts = [
            Math.round(remaining * 0.1),
            Math.round(remaining * 0.25),
            Math.round(remaining * 0.5),
            remaining
          ].filter(a => a > 0);
        }
      },
      error: err => {
        this.loading = false;
        this.error = {
          title: 'No pudimos cargar el regalo',
          message: 'Por favor, intenta nuevamente.',
          icon: '📦'
        };
      }
    });
  }

  selectAmount(amount: number): void {
    this.contributionAmount = amount;
  }

  reserveComplete(): void {
    if (!this.userName.trim() || !this.gift) return;

    this.reserving = true;
    this.error = null;

    const request: ReserveGiftRequest = {
      userId: this.authService.getUserId(),
      guestName: this.userName.trim()
    };

    this.authService.setUserName(this.userName.trim());

    this.giftService.reserveGift(this.giftId, request).subscribe({
      next: response => {
        this.reserving = false;
        this.submitted = true;
        this.successMessage = `${this.userName}, tu generosidad nos llena de alegría. ¡Gracias por regalarnos ${
          this.gift!.name
        }! 🎁`;
        if (response.token) {
          this.stateService.addCommitment(response.token);
        }
      },
      error: err => {
        this.reserving = false;
        this.error = {
          title: 'No pudimos procesar tu reserva',
          message: 'Es posible que alguien más lo haya reservado primero. Intenta con otro regalo.',
          icon: '😔'
        };
      }
    });
  }

  contribute(): void {
    if (!this.userName.trim() || !this.contributionAmount || !this.gift) return;

    this.contributing = true;
    this.error = null;

    const request: ContributeGiftRequest = {
      userId: this.authService.getUserId(),
      guestName: this.userName.trim(),
      contributionAmount: this.contributionAmount,
      notes: this.contributionMessage.trim() || undefined
    };

    this.authService.setUserName(this.userName.trim());

    this.giftService.contributeToGift(this.giftId, request).subscribe({
      next: response => {
        this.contributing = false;
        this.submitted = true;
        this.successMessage = `${this.userName}, tu aporte de $${this.contributionAmount} nos ayuda muchísimo. ¡Gracias por tu cariño! 💝`;
        if (response.token) {
          this.stateService.addCommitment(response.token);
        }
      },
      error: err => {
        this.contributing = false;
        this.error = {
          title: 'No pudimos procesar tu aporte',
          message: 'Por favor, intenta nuevamente.',
          icon: '😔'
        };
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Reservado',
      PARTIALLY_FUNDED: 'En progreso',
      FULLY_FUNDED: 'Completado',
      INACTIVE: 'Inactivo'
    };
    return labels[status] || status;
  }

  getBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      AVAILABLE: 'badge-success',
      RESERVED: 'badge-warning',
      PARTIALLY_FUNDED: 'badge-info',
      FULLY_FUNDED: 'badge-danger',
      INACTIVE: 'badge-muted'
    };
    return `badge ${classes[status] || ''}`;
  }

  goBackToList(): void {
    this.router.navigate([`/e/${this.slug}/gifts`]);
  }

  navigate(path: string): void {
    this.router.navigate([`/e/${this.slug}/${path}`]);
  }
}
