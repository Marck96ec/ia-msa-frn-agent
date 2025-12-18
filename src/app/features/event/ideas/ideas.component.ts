import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IdeaService, AuthService, StateService } from '@core/services';
import { CreateIdeaRequest } from '@core/models';
import {
  EventHeaderComponent,
  LoadingSpinnerComponent,
  SuccessMessageComponent,
  ErrorMessageComponent
} from '@shared/components';

@Component({
  selector: 'app-ideas',
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
    <div class="min-h-screen bg-gradient-to-br from-baby-yellow/20 to-baby-pink/20">
      <app-event-header
        [eventName]="eventName"
        subtitle="Sugerencias"
        [showBack]="true"
        [backRoute]="'/e/' + slug + '/support'"
      />

      <div class="max-w-2xl mx-auto px-6 py-8 pb-32">
        <div *ngIf="!submitted" class="space-y-6 animate-slide-up">
          <div class="text-center">
            <div class="text-6xl mb-4">💡</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-3 text-balance">¿Tienes alguna idea de regalo?</h2>
            <p class="text-gray-600 text-lg">Nos encantaría conocer tu sugerencia</p>
          </div>

          <div class="card space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Tu nombre <span class="text-red-500">*</span>
              </label>
              <input type="text" [(ngModel)]="userName" placeholder="¿Cómo te llamas?" class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Tu idea <span class="text-red-500">*</span>
              </label>
              <textarea
                [(ngModel)]="suggestion"
                placeholder="Ejemplo: Pañales talla M, ropa de 6 meses, juguetes educativos..."
                rows="5"
                class="input-field resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Comparte cualquier cosa que creas que sería útil o especial</p>
            </div>

            <button
              (click)="submit()"
              [disabled]="!canSubmit() || loading"
              class="btn-primary w-full disabled:opacity-50"
            >
              {{ loading ? 'Enviando...' : 'Enviar mi idea ✨' }}
            </button>
          </div>
        </div>

        <app-loading-spinner *ngIf="loading && !submitted" message="Guardando tu idea..." />

        <div *ngIf="submitted" class="space-y-6 animate-slide-up">
          <app-success-message
            [title]="'¡Gracias por tu idea!'"
            [message]="'Tu sugerencia es muy valiosa para nosotros 💛'"
            [icon]="'✨'"
          />

          <div class="space-y-3">
            <button (click)="navigate('baby-message')" class="btn-primary w-full">Dejar mensaje para el bebé</button>
            <button (click)="navigate('gifts')" class="btn-outline w-full">Ver lista de regalos</button>
            <button (click)="navigate('thanks')" class="btn-outline w-full">Finalizar</button>
          </div>
        </div>

        <app-error-message *ngIf="error" [error]="error" (retry)="submit()" />
      </div>
    </div>
  `
})
export class IdeasComponent implements OnInit {
  slug: string = '';
  eventName: string = 'Baby Shower';
  userName: string = '';
  suggestion: string = '';
  loading = false;
  submitted = false;
  error: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ideaService: IdeaService,
    private authService: AuthService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const event = this.stateService.getCurrentEvent();
    if (event) {
      this.eventName = `Sugerencias para ${event.babyName}`;
    }

    const savedName = this.authService.getUserName();
    if (savedName) {
      this.userName = savedName;
    }
  }

  canSubmit(): boolean {
    return this.userName.trim().length > 0 && this.suggestion.trim().length > 5;
  }

  submit(): void {
    if (!this.canSubmit()) return;

    const event = this.stateService.getCurrentEvent();
    if (!event) return;

    this.loading = true;
    this.error = null;

    const request: CreateIdeaRequest = {
      userId: this.authService.getUserId(),
      guestName: this.userName.trim(),
      description: this.suggestion.trim()
    };

    this.authService.setUserName(this.userName.trim());

    this.ideaService.createIdea(event.slug, request).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
      },
      error: err => {
        this.loading = false;
        this.error = {
          title: 'No pudimos guardar tu idea',
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
