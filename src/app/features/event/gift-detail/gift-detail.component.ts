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
                <div class="text-left bg-white/80 rounded-2xl p-4 shadow-inner space-y-2">
                  <p class="text-sm font-semibold text-gray-800">Opciones para apoyar:</p>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>🎁 Traer el regalo el día del baby shower</li>
                    <li>💌 Aportar el valor para que nosotros lo compremos por ti</li>
                  </ul>
                </div>

                <div class="text-left bg-white/60 rounded-2xl p-4 text-sm text-gray-700 space-y-3">
                  <p class="font-semibold text-gray-800">💳 Si deseas aportar el valor:</p>

                  <!-- Deuna QR -->
                  <div
                    class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 border border-purple-500 text-white"
                  >
                    <div class="flex items-center justify-center gap-2 mb-3">
                      <img src="assets/deuna-logo.png" alt="Deuna" class="h-6" />
                      <span class="font-bold text-lg">Pago con Deuna</span>
                    </div>

                    <!-- QR desplegable -->
                    <details class="text-center">
                      <summary class="text-sm text-purple-200 cursor-pointer hover:text-white">Ver código QR</summary>
                      <div class="flex justify-center bg-white rounded-lg p-2 mt-2">
                        <img src="assets/deuna-qr.png" alt="QR Deuna - Marco Clavijo" class="w-36 h-36" />
                      </div>
                    </details>
                    <p class="text-xs text-purple-300 text-center mt-2">Titular: Clavijo Reascos Marco Patricio</p>
                  </div>

                  <!-- Transferencia bancaria -->
                  <div
                    class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 border border-blue-600 text-white"
                  >
                    <div class="flex items-center justify-center gap-2 mb-3">
                      <img src="assets/pichincha-logo.png" alt="Banco Pichincha" class="h-8" />
                      <span class="font-bold text-lg">Transferencia Bancaria</span>
                    </div>
                    <div class="bg-white/10 rounded-lg p-3 space-y-2 text-sm">
                      <p><span class="text-blue-300">Banco:</span> Banco Pichincha</p>
                      <p><span class="text-blue-300">Tipo:</span> Ahorro transaccional</p>
                      <div class="flex items-center justify-between gap-2">
                        <p>
                          <span class="text-blue-300">Número:</span> <span class="font-mono font-bold">2203444745</span>
                        </p>
                        <button
                          (click)="copyAccountNumber()"
                          class="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded transition-colors"
                        >
                          {{ accountCopied ? '✅ Copiado' : '📋 Copiar' }}
                        </button>
                      </div>
                      <p><span class="text-blue-300">Titular:</span> Marco Clavijo</p>
                    </div>
                  </div>

                  <p class="text-xs text-gray-500 mt-2">
                    Cuando realices el aporte, o si prefieres traerlo el día del baby shower, confírmalo en la app para
                    marcar el regalito como reservado.
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

          <!-- Already reserved - Show payment info -->
          <div *ngIf="gift.status === GiftStatus.RESERVED" class="space-y-4">
            <div class="card text-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div class="text-5xl mb-3">🎁</div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Este regalo ya está reservado</h3>

              <!-- Info del reservador -->
              <div *ngIf="gift.reserverName" class="bg-white/60 rounded-lg p-3 mt-3 text-sm">
                <p class="text-gray-600">
                  <span class="font-medium">Reservado por:</span>
                  <span class="font-bold text-gray-800">{{ maskName(gift.reserverName) }}</span>
                </p>
                <p *ngIf="gift.reservedAt" class="text-gray-500 text-xs mt-1">
                  {{ formatReservedDate(gift.reservedAt) }}
                </p>
              </div>

              <p class="text-gray-600 mt-3">Si tú lo reservaste, aquí tienes la información para realizar el pago:</p>
            </div>

            <!-- Payment Methods Card -->
            <div class="card">
              <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">💳 Métodos de pago</h3>

              <div class="space-y-4">
                <!-- Deuna -->
                <div
                  class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 border border-purple-500 text-white"
                >
                  <div class="flex items-center justify-center gap-2 mb-3">
                    <img src="assets/deuna-logo.png" alt="Deuna" class="h-6" />
                    <span class="font-bold text-lg">Pago con Deuna</span>
                  </div>

                  <!-- QR desplegable -->
                  <details class="text-center">
                    <summary class="text-sm text-purple-200 cursor-pointer hover:text-white">Ver código QR</summary>
                    <div class="flex justify-center bg-white rounded-lg p-2 mt-2">
                      <img src="assets/deuna-qr.png" alt="QR Deuna - Marco Clavijo" class="w-36 h-36" />
                    </div>
                  </details>
                  <p class="text-xs text-purple-300 text-center mt-2">Titular: Clavijo Reascos Marco Patricio</p>
                </div>

                <!-- Transferencia bancaria -->
                <div
                  class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 border border-blue-600 text-white"
                >
                  <div class="flex items-center justify-center gap-2 mb-3">
                    <img src="assets/pichincha-logo.png" alt="Banco Pichincha" class="h-8" />
                    <span class="font-bold text-lg">Transferencia Bancaria</span>
                  </div>
                  <div class="bg-white/10 rounded-lg p-3 space-y-2 text-sm">
                    <p><span class="text-blue-300">Banco:</span> Banco Pichincha</p>
                    <p><span class="text-blue-300">Tipo:</span> Ahorro transaccional</p>
                    <div class="flex items-center justify-between gap-2">
                      <p>
                        <span class="text-blue-300">Número:</span> <span class="font-mono font-bold">2203444745</span>
                      </p>
                      <button
                        (click)="copyAccountNumber()"
                        class="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded transition-colors"
                      >
                        {{ accountCopied ? '✅ Copiado' : '📋 Copiar' }}
                      </button>
                    </div>
                    <p><span class="text-blue-300">Titular:</span> Marco Clavijo</p>
                  </div>
                </div>
              </div>

              <p class="text-xs text-gray-500 mt-4 text-center">
                También puedes traer el regalo el día del baby shower 🎉
              </p>
            </div>

            <button (click)="goBackToList()" class="btn-outline w-full">Ver otros regalos</button>
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
  accountCopied = false;

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

  copyAccountNumber(): void {
    const accountNumber = '2203444745';

    // Intentar con Clipboard API moderna
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(accountNumber)
        .then(() => {
          this.showCopiedFeedback();
        })
        .catch(() => {
          this.fallbackCopy(accountNumber);
        });
    } else {
      // Fallback para navegadores sin soporte o sin HTTPS
      this.fallbackCopy(accountNumber);
    }
  }

  private fallbackCopy(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      this.showCopiedFeedback();
    } catch (err) {
      // Si falla, al menos el usuario puede copiar manualmente
      alert('Número de cuenta: ' + text);
    }

    document.body.removeChild(textArea);
  }

  private showCopiedFeedback(): void {
    this.accountCopied = true;
    setTimeout(() => {
      this.accountCopied = false;
    }, 2000);
  }

  maskName(name: string): string {
    if (!name || name.length < 3) return '***';

    const words = name.trim().split(' ');
    return words
      .map(word => {
        if (word.length <= 2) return word;
        const visibleChars = Math.min(4, Math.ceil(word.length * 0.4));
        return word.substring(0, visibleChars) + '*'.repeat(word.length - visibleChars);
      })
      .join(' ');
  }

  formatReservedDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Reservado hoy';
      if (diffDays === 1) return 'Reservado ayer';
      if (diffDays < 7) return `Reservado hace ${diffDays} días`;

      return (
        'Reservado el ' +
        date.toLocaleDateString('es-EC', {
          day: 'numeric',
          month: 'short'
        })
      );
    } catch {
      return '';
    }
  }
}
