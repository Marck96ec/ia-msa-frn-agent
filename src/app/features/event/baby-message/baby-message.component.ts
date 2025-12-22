import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BabyMessageService, AuthService, StateService } from '@core/services';
import { BabyMessage, CreateBabyMessageRequest } from '@core/models';
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
    <div class="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50">
      <app-event-header
        [eventName]="eventName"
        subtitle="Un regalo que durará para siempre"
        [showBack]="true"
        [backRoute]="'/e/' + slug + '/support'"
      />

      <div class="max-w-2xl mx-auto px-6 py-8 pb-32">
        <!-- Estado: Escribiendo mensaje -->
        <div *ngIf="!submitted" class="space-y-8">
          <!-- Encabezado emocional -->
          <div class="text-center space-y-4 animate-fade-in">
            <div class="relative inline-block">
              <span class="text-7xl animate-float">💛</span>
              <span class="absolute -bottom-1 -right-1 text-3xl animate-pulse">✨</span>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 leading-tight">
              Un mensaje que {{ babyName }} <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
                leerá cuando crezca
              </span>
            </h2>
            <p class="text-gray-600 text-lg max-w-md mx-auto">
              Escribe unas palabras llenas de amor que quedarán guardadas para siempre
            </p>
          </div>

          <!-- Inspiración: mensajes recibidos -->
          <div *ngIf="recentMessages.length > 0 && !messagesLoading" class="space-y-3 animate-fade-in-delay">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span class="text-lg">💌</span>
              <span class="font-medium">Otros ya dejaron su huella de amor</span>
            </div>
            <div class="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x scrollbar-hide">
              <div
                *ngFor="let m of recentMessages; let i = index"
                class="flex-shrink-0 w-64 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-amber-100 shadow-soft snap-start transition-smooth hover-scale"
              >
                <p class="text-gray-700 text-sm leading-relaxed line-clamp-3 italic">"{{ m.messageText }}"</p>
                <p class="text-right text-xs font-semibold text-amber-600 mt-3">— {{ m.guestName || 'Con amor' }}</p>
              </div>
            </div>
          </div>

          <!-- Loading mensajes -->
          <div *ngIf="messagesLoading" class="flex items-center justify-center gap-3 text-amber-600 py-4">
            <span class="text-2xl animate-bounce">✨</span>
            <span class="text-sm">Cargando mensajes especiales...</span>
          </div>

          <!-- Formulario de mensaje -->
          <div
            class="bg-white/90 backdrop-blur-sm border-2 border-white shadow-xl rounded-3xl p-6 space-y-5 animate-fade-in-delay-2"
          >
            <!-- Campo nombre -->
            <div class="space-y-2">
              <label for="userName" class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span>👤</span>
                <span>¿Quién escribe estas palabras?</span>
              </label>
              <input
                id="userName"
                type="text"
                [(ngModel)]="userName"
                placeholder="Tu nombre o cómo quieres que te recuerde"
                class="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-smooth"
                [class.border-amber-300]="userName.trim().length > 0"
                [class.bg-amber-50]="userName.trim().length > 0"
              />
            </div>

            <!-- Campo mensaje con placeholder dinámico -->
            <div class="space-y-2">
              <label for="message" class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span>💬</span>
                <span>Tu mensaje para {{ babyName }}</span>
              </label>
              <div class="relative">
                <textarea
                  id="message"
                  [(ngModel)]="message"
                  [placeholder]="currentPlaceholder"
                  rows="5"
                  class="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-smooth resize-none"
                  [class.border-amber-300]="message.trim().length > 0"
                  [class.bg-amber-50]="message.trim().length > 0"
                  (focus)="onMessageFocus()"
                  (blur)="onMessageBlur()"
                ></textarea>

                <!-- Contador de caracteres suave -->
                <div
                  *ngIf="message.length > 0"
                  class="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-0.5 rounded-full"
                >
                  {{ message.length }} caracteres de amor
                </div>
              </div>

              <!-- Ayuda empática -->
              <p class="text-sm text-gray-500 flex items-center gap-2">
                <span class="text-amber-500">💡</span>
                <span>No tiene que ser perfecto. Escríbelo como salga del corazón</span>
              </p>
            </div>

            <!-- Sugerencias de tipo de mensaje -->
            <div class="space-y-2">
              <p class="text-xs text-gray-500 font-medium">¿Necesitas inspiración?</p>
              <div class="flex flex-wrap gap-2">
                <button
                  *ngFor="let suggestion of messageSuggestions"
                  (click)="applySuggestion(suggestion)"
                  class="text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 text-gray-700 hover:from-amber-100 hover:to-rose-100 hover:border-amber-300 transition-smooth hover-lift active-press"
                >
                  {{ suggestion.emoji }} {{ suggestion.label }}
                </button>
              </div>
            </div>

            <!-- Emojis decorativos -->
            <div class="pt-3 border-t border-gray-100">
              <p class="text-xs text-gray-500 mb-2">Añade un toque especial</p>
              <div class="flex flex-wrap gap-1">
                <button
                  *ngFor="let emoji of quickEmojis"
                  (click)="addEmoji(emoji)"
                  class="text-2xl p-2 hover:bg-amber-50 rounded-xl transition-fast active-press"
                  [attr.aria-label]="'Añadir emoji ' + emoji"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>

            <!-- Botón enviar -->
            <button
              (click)="submit()"
              [disabled]="!canSubmit() || loading"
              class="w-full py-4 px-6 rounded-2xl font-bold text-lg transition-smooth disabled:cursor-not-allowed"
              [class]="
                canSubmit() && !loading
                  ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 text-white shadow-lg hover:shadow-xl hover-scale active-press'
                  : 'bg-gray-200 text-gray-400'
              "
            >
              <span *ngIf="!loading" class="flex items-center justify-center gap-2">
                <span>Enviar mi mensaje con amor</span>
                <span class="text-xl">💌</span>
              </span>
              <span *ngIf="loading" class="flex items-center justify-center gap-2">
                <span class="animate-spin inline-block">💫</span>
                <span>Guardando tu mensaje...</span>
              </span>
            </button>

            <!-- Validación amable -->
            <p
              *ngIf="!canSubmit() && (userName.length > 0 || message.length > 0)"
              class="text-center text-sm text-amber-600"
            >
              {{ getValidationMessage() }}
            </p>
          </div>
        </div>

        <!-- Estado: Mensaje enviado -->
        <div *ngIf="submitted" class="space-y-8 animate-fade-in">
          <!-- Celebración -->
          <div class="text-center space-y-4">
            <div class="relative inline-block">
              <span class="text-8xl animate-bounce-gentle">💌</span>
              <span class="absolute -top-2 -right-2 text-4xl animate-spin-slow">✨</span>
              <span class="absolute -bottom-1 -left-2 text-3xl animate-pulse">💛</span>
            </div>
            <h2 class="text-3xl font-bold text-gray-800">
              ¡Tu mensaje quedó guardado
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
                para siempre!
              </span>
            </h2>
            <p class="text-gray-600 text-lg">Algún día {{ babyName }} leerá estas hermosas palabras 💕</p>
          </div>

          <!-- Preview del mensaje enviado -->
          <div class="bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-200 rounded-3xl p-6 shadow-soft">
            <div class="flex items-start gap-3">
              <span class="text-3xl">📜</span>
              <div class="flex-1">
                <p class="text-gray-700 text-lg italic leading-relaxed">"{{ message }}"</p>
                <p class="text-right text-sm font-bold text-amber-600 mt-4">— {{ userName }}, con amor 💛</p>
              </div>
            </div>
          </div>

          <!-- Acciones siguientes -->
          <div class="space-y-4">
            <p class="text-center text-gray-600">¿Qué te gustaría hacer ahora?</p>
            <button (click)="navigate('thanks')" class="btn-primary w-full text-lg py-4">Ya terminé, gracias 💕</button>
            <button (click)="navigate('gifts')" class="btn-outline w-full">Ver la lista de regalos 🎁</button>
          </div>
        </div>

        <!-- Error con empatía -->
        <div
          *ngIf="error"
          class="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center space-y-4 animate-fade-in"
        >
          <span class="text-5xl">😔</span>
          <h3 class="text-xl font-bold text-gray-800">{{ error.title }}</h3>
          <p class="text-gray-600">{{ error.message }}</p>
          <button (click)="retrySubmit()" class="btn-primary">Intentar de nuevo 💪</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      @keyframes bounce-gentle {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }
      @keyframes scale-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulse-soft {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
      .animate-float {
        animation: float 2.5s ease-in-out infinite;
      }
      .animate-fade-in {
        animation: fadeIn 0.2s ease-out forwards;
      }
      .animate-fade-in-delay {
        animation: fadeIn 0.2s ease-out 0.05s forwards;
        opacity: 0;
      }
      .animate-fade-in-delay-2 {
        animation: fadeIn 0.2s ease-out 0.1s forwards;
        opacity: 0;
      }
      .animate-scale-in {
        animation: scale-in 0.15s ease-out forwards;
      }
      .animate-slide-up {
        animation: slide-up 0.2s ease-out forwards;
      }
      .animate-bounce-gentle {
        animation: bounce-gentle 1.5s ease-in-out infinite;
      }
      .animate-spin-slow {
        animation: spin 8s linear infinite;
      }
      .animate-pulse-soft {
        animation: pulse-soft 2s ease-in-out infinite;
      }
      /* Transiciones suaves para interacciones */
      .transition-fast {
        transition: all 0.15s ease-out;
      }
      .transition-smooth {
        transition: all 0.2s ease-out;
      }
      .hover-lift:hover {
        transform: translateY(-2px);
      }
      .hover-scale:hover {
        transform: scale(1.02);
      }
      .active-press:active {
        transform: scale(0.98);
      }
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
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `
  ]
})
export class BabyMessageComponent implements OnInit {
  slug = '';
  eventName = 'Mensaje para el bebé';
  babyName = 'el bebé';
  userName = '';
  message = '';
  loading = false;
  submitted = false;
  error: any = null;
  isMessageFocused = false;

  // Placeholders dinámicos
  placeholders = [
    'Querido Thiago, cuando leas esto queremos que sepas que...',
    'Pequeño Thiago, te deseamos una vida llena de...',
    'Para cuando seas grande, recuerda siempre que...',
    'Thiago, el día que llegaste al mundo todos sentimos...'
  ];
  currentPlaceholder = '';
  private placeholderIndex = 0;
  private placeholderInterval: any;

  // Sugerencias para evitar bloqueo creativo
  messageSuggestions = [
    { emoji: '🌟', label: 'Un deseo', template: 'Querido {baby}, te deseo que tu vida esté llena de ' },
    { emoji: '💪', label: 'Un consejo', template: 'Querido {baby}, cuando crezcas recuerda siempre que ' },
    { emoji: '💝', label: 'Una bendición', template: 'Que Dios bendiga cada paso que des, {baby}. ' },
    { emoji: '🎈', label: 'Una promesa', template: '{baby}, siempre estaré aquí para ' }
  ];

  quickEmojis = ['💛', '💙', '💗', '🌟', '✨', '🍼', '👶', '🧸', '🎀', '🌈'];

  recentMessages: BabyMessage[] = [];
  messagesLoading = false;
  messagesError = false;

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
      this.babyName = event.babyName || 'Thiago';
      this.eventName = `Mensaje para ${this.babyName}`;
      this.updatePlaceholders();
    }

    const savedName = this.authService.getUserName();
    if (savedName) {
      this.userName = savedName;
    }

    this.currentPlaceholder = this.placeholders[0];
    this.startPlaceholderRotation();

    if (this.slug) {
      this.loadRecentMessages();
    }
  }

  private updatePlaceholders(): void {
    this.placeholders = [
      `Querido ${this.babyName}, cuando leas esto queremos que sepas que...`,
      `Pequeño ${this.babyName}, te deseamos una vida llena de...`,
      `Para cuando seas grande, recuerda siempre que...`,
      `${this.babyName}, el día que llegaste al mundo todos sentimos...`
    ];
    this.messageSuggestions = this.messageSuggestions.map(s => ({
      ...s,
      template: s.template.replace('{baby}', this.babyName)
    }));
  }

  private startPlaceholderRotation(): void {
    this.placeholderInterval = setInterval(() => {
      if (!this.isMessageFocused && this.message.length === 0) {
        this.placeholderIndex = (this.placeholderIndex + 1) % this.placeholders.length;
        this.currentPlaceholder = this.placeholders[this.placeholderIndex];
      }
    }, 4000);
  }

  onMessageFocus(): void {
    this.isMessageFocused = true;
  }

  onMessageBlur(): void {
    this.isMessageFocused = false;
  }

  applySuggestion(suggestion: { emoji: string; label: string; template: string }): void {
    this.message = suggestion.template;
  }

  addEmoji(emoji: string): void {
    this.message += emoji;
  }

  canSubmit(): boolean {
    return this.userName.trim().length > 0 && this.message.trim().length >= 10;
  }

  getValidationMessage(): string {
    if (this.userName.trim().length === 0) {
      return '¿Nos dices tu nombre? 😊';
    }
    if (this.message.trim().length === 0) {
      return 'Escribe algo bonito para el bebé 💛';
    }
    if (this.message.trim().length < 10) {
      return `Solo ${10 - this.message.trim().length} caracteres más... ¡tú puedes! ✨`;
    }
    return '';
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
        if (this.placeholderInterval) {
          clearInterval(this.placeholderInterval);
        }
      },
      error: () => {
        this.loading = false;
        this.error = {
          title: 'No pudimos guardar tu mensaje',
          message: 'Por favor, intenta nuevamente en un momento.'
        };
      }
    });
  }

  retrySubmit(): void {
    this.error = null;
    this.submit();
  }

  navigate(path: string): void {
    this.router.navigate([`/e/${this.slug}/${path}`]);
  }

  private loadRecentMessages(): void {
    this.messagesLoading = true;
    this.messagesError = false;

    this.babyMessageService.getBabyMessages(this.slug, false).subscribe({
      next: messages => {
        this.recentMessages = (messages || []).slice(0, 3);
        this.messagesLoading = false;
      },
      error: () => {
        this.messagesLoading = false;
        this.messagesError = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }
}
