import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BabyMessageService, AuthService, StateService } from '@core/services';
import { CreateBabyMessageRequest } from '@core/models';
import {
  EventHeaderComponent,
  LoadingSpinnerComponent,
  SuccessMessageComponent,
  ErrorMessageComponent
} from '@shared/components';

@Component({
  selector: 'app-baby-message',
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
    <div class="min-h-screen bg-gradient-to-br from-baby-blue/20 to-baby-pink/20">
      <app-event-header
        [eventName]="eventName"
        subtitle="Mensaje para el bebé"
        [showBack]="true"
        [backRoute]="'/e/' + slug + '/support'"
      />

      <div class="max-w-2xl mx-auto px-6 py-8 pb-32">
        <div *ngIf="!submitted" class="space-y-6 animate-slide-up">
          <div class="text-center">
            <div class="text-6xl mb-4">👶</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-3 text-balance">Dale la bienvenida al pequeñito</h2>
            <p class="text-gray-600 text-lg">Deja unas palabras que podrá leer cuando sea grande</p>
          </div>

          <div class="card space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Tu nombre <span class="text-red-500">*</span>
              </label>
              <input type="text" [(ngModel)]="userName" placeholder="¿Quién le escribe?" class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Tu mensaje <span class="text-red-500">*</span>
              </label>
              <textarea
                [(ngModel)]="message"
                placeholder="Querido/a bebé, te deseamos..."
                rows="6"
                class="input-field resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                Escribe desde el corazón. Puedes incluir deseos, consejos o simplemente cariño 💙
              </p>
            </div>

            <!-- Emojis rápidos -->
            <div class="flex flex-wrap gap-2">
              <button
                *ngFor="let emoji of quickEmojis"
                (click)="addEmoji(emoji)"
                class="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {{ emoji }}
              </button>
            </div>

            <button
              (click)="submit()"
              [disabled]="!canSubmit() || loading"
              class="btn-primary w-full disabled:opacity-50"
            >
              {{ loading ? 'Enviando...' : 'Enviar mensaje 💌' }}
            </button>
          </div>
        </div>

        <app-loading-spinner *ngIf="loading && !submitted" message="Guardando tu mensaje..." />

        <div *ngIf="submitted" class="space-y-6 animate-slide-up">
          <app-success-message
            [title]="'¡Mensaje enviado con amor!'"
            [message]="'Tus palabras quedarán guardadas para siempre 💕'"
            [icon]="'💌'"
          />

          <div class="card bg-baby-blue/20 border-2 border-baby-blue">
            <p class="text-sm text-gray-600 italic">"{{ message }}"</p>
            <p class="text-right text-sm font-semibold text-gray-700 mt-2">— {{ userName }}</p>
          </div>

          <div class="space-y-3">
            <button (click)="navigate('chat')" class="btn-primary w-full">¿Tienes alguna duda?</button>
            <button (click)="navigate('thanks')" class="btn-outline w-full">Finalizar</button>
          </div>
        </div>

        <app-error-message *ngIf="error" [error]="error" (retry)="submit()" />
      </div>
    </div>
  `
})
export class BabyMessageComponent implements OnInit {
  slug: string = '';
  eventName: string = 'Baby Shower';
  userName: string = '';
  message: string = '';
  loading = false;
  submitted = false;
  error: any = null;

  quickEmojis = ['💙', '💗', '🍼', '👶', '✨', '🌟', '💫', '🎈', '🎀', '🧸'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private babyMessageService: BabyMessageService,
    private authService: AuthService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const event = this.stateService.getCurrentEvent();
    if (event) {
      this.eventName = `Mensaje para ${event.babyName}`;
    }

    const savedName = this.authService.getUserName();
    if (savedName) {
      this.userName = savedName;
    }
  }

  canSubmit(): boolean {
    return this.userName.trim().length > 0 && this.message.trim().length > 10;
  }

  addEmoji(emoji: string): void {
    this.message += emoji;
  }

  submit(): void {
    if (!this.canSubmit()) return;

    const event = this.stateService.getCurrentEvent();
    if (!event) return;

    this.loading = true;
    this.error = null;

    const request: CreateBabyMessageRequest = {
      userId: this.authService.getUserId(),
      guestName: this.userName.trim(),
      messageText: this.message.trim()
    };

    this.authService.setUserName(this.userName.trim());

    this.babyMessageService.createBabyMessage(event.slug, request).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
      },
      error: err => {
        this.loading = false;
        this.error = {
          title: 'No pudimos guardar tu mensaje',
          message: 'Por favor, intenta nuevamente.',
          icon: '😔'
        };
      }
    });
  }

  navigate(path: string): void {
    this.router.navigate([`/e/${this.slug}/${path}`]);
  }
}
