import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService, AuthService, StateService } from '@core/services';
import { ChatMessage, ChatRequest, ChatMode, QuickReply } from '@core/models';
import { EventHeaderComponent, LoadingSpinnerComponent, QuickRepliesComponent } from '@shared/components';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, EventHeaderComponent, LoadingSpinnerComponent, QuickRepliesComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-event-header 
        [eventName]="'Preguntas y respuestas'"
        subtitle="Asistente MCG"
        [showBack]="true"
        [backRoute]="'/e/' + slug + '/welcome'" />

      <div class="flex-1 overflow-y-auto px-4 py-6 pb-32" #messagesContainer>
        <div class="max-w-2xl mx-auto space-y-4">
          <!-- Mensaje inicial -->
          <div *ngIf="messages.length === 0" class="text-center py-8">
            <div class="text-6xl mb-4">💬</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">¡Hola! Soy el Asistente MCG</h3>
            <p class="text-gray-600">
              Pregúntame lo que quieras sobre el evento, regalos o cualquier duda que tengas
            </p>
          </div>

          <!-- Messages -->
          <div *ngFor="let msg of messages" 
               [class.flex-row-reverse]="msg.role === 'user'"
               class="flex gap-2 animate-slide-up">
            <div [class]="msg.role === 'user' ? 'message-user' : 'message-assistant'">
              {{ msg.content }}
            </div>
          </div>

          <!-- Loading -->
          <div *ngIf="loading" class="flex gap-2">
            <div class="message-assistant">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Replies -->
      <div *ngIf="currentQuickReplies.length > 0 && !loading" 
           class="bg-white border-t border-gray-200 py-3 safe-area-bottom">
        <app-quick-replies 
          [replies]="currentQuickReplies"
          (selected)="onQuickReplySelected($event)" />
      </div>

      <!-- Input -->
      <div class="bg-white border-t-2 border-gray-200 p-4 safe-area-bottom">
        <div class="max-w-2xl mx-auto flex gap-2">
          <input 
            type="text"
            [(ngModel)]="currentMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Escribe tu pregunta..."
            class="input-field flex-1">
          <button 
            (click)="sendMessage()"
            [disabled]="!currentMessage.trim() || loading"
            class="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-600 transition-colors">
            Enviar
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer?: ElementRef;

  slug: string = '';
  messages: ChatMessage[] = [];
  currentMessage: string = '';
  currentQuickReplies: QuickReply[] = [];
  loading = false;
  private shouldScroll = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(customMessage?: string): void {
    const messageText = customMessage || this.currentMessage.trim();
    if (!messageText || this.loading) return;

    const event = this.stateService.getCurrentEvent();
    if (!event) return;

    // Agregar mensaje del usuario
    this.messages.push({
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    });

    this.currentMessage = '';
    this.currentQuickReplies = [];
    this.loading = true;
    this.shouldScroll = true;

    const request: ChatRequest = {
      conversationId: this.authService.getConversationId() || undefined,
      userId: this.authService.getUserId(),
      eventId: event.id,
      message: messageText,
      mode: ChatMode.EVENT
    };

    this.chatService.sendMessage(request).subscribe({
      next: (response) => {
        // Guardar conversationId
        if (response.conversationId) {
          this.authService.setConversationId(response.conversationId);
        }

        // Agregar respuesta del asistente
        this.messages.push({
          role: 'assistant',
          content: response.response,
          timestamp: new Date().toISOString(),
          quickReplies: response.quickReplies
        });

        // Actualizar quick replies
        if (response.quickReplies && response.quickReplies.length > 0) {
          this.currentQuickReplies = response.quickReplies;
        }

        // Manejar acciones
        if (response.action) {
          this.handleAction(response.action);
        }

        this.loading = false;
        this.shouldScroll = true;
      },
      error: (err) => {
        this.messages.push({
          role: 'assistant',
          content: 'Perdón, tuve un problema al procesar tu mensaje. ¿Puedes intentar de nuevo? 😔',
          timestamp: new Date().toISOString()
        });
        this.loading = false;
        this.shouldScroll = true;
      }
    });
  }

  onQuickReplySelected(reply: QuickReply): void {
    if (reply.action) {
      // Si tiene acción, navegar o ejecutar
      this.handleQuickReplyAction(reply);
    } else {
      // Enviar como mensaje
      this.sendMessage(reply.value);
    }
  }

  handleQuickReplyAction(reply: QuickReply): void {
    switch (reply.action) {
      case 'navigate_gifts':
        this.router.navigate([`/e/${this.slug}/gifts`]);
        break;
      case 'navigate_location':
        this.router.navigate([`/e/${this.slug}/welcome`]);
        break;
      case 'navigate_rsvp':
        this.router.navigate([`/e/${this.slug}/rsvp`]);
        break;
      default:
        this.sendMessage(reply.value);
    }
  }

  handleAction(action: any): void {
    if (action.type === 'navigate' && action.data?.path) {
      setTimeout(() => {
        this.router.navigate([`/e/${this.slug}/${action.data.path}`]);
      }, 1500);
    }
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
